import chalk from "chalk";
import globby from "globby";
import path from "path";
import { IDictionary } from "common-types";
import { isAutoindexFile, processFiles, watchHandler } from "../private";
import { getMonoRepoPackages, highlightFilepath } from "~/shared";
import { FSWatcher, watch } from "chokidar";

/**
 * Watches for changes in any file where an autoindex file resides
 */
function setupWatcherDir(dir: string, ignored: string[] = [], opts: IDictionary) {
  const EVENTS: string[] = ["add", "change", "unlink", "link"];

  const h = watchHandler(dir, opts);

  const watcher = watch(dir, {
    ignored,
    persistent: true,
    usePolling: true,
    interval: 100,
  });
  watcher.on("ready", () => {
    watcher.on("error", (e) => {
      console.log(chalk`{red Error occurred watching "${dir}":} ${e.message}\n`);
    });

    for (const evt of EVENTS) {
      watcher.on(
        evt,
        h((evt.includes("Dir") ? `${evt}ed directory` : `${evt}ed`).replace("ee", "e"))
      );
    }
  });

  return watcher;
}

/**
 * Watch for changes to autoindex files and add/remove file watchers in response
 */
async function setupAutoIndexWatcher(watched: IDictionary<FSWatcher>, opts: IDictionary) {
  const log = console.log.bind(console);
  const watcher = watch("**/index.[jt]s", {
    ignored: "node_modules/*",
    persistent: true,
    usePolling: true,
    interval: 100,
  });
  watcher.on("error", (e) => {
    log(
      chalk`{red Error occurred watching for changes to autoindex files:} ${e.message}\n`
    );
  });

  watcher.on("ready", () => {
    const handlerForAutoIndexFiles = (evt: string) => {
      return async (filepath: string) => {
        if (!/(index|private)\.[jt]s/.test(filepath)) {
          return;
        }

        const watchedDirs = Object.keys(watched);
        const dir = path.posix.dirname(filepath);

        switch (evt) {
          case "change":
            if (watchedDirs.includes(dir) && !isAutoindexFile(filepath)) {
              log(
                chalk`- index file ${highlightFilepath(
                  filepath
                )} is no longer an {italic autoindex} file`
              );
              if (watched[filepath]) {
                await watched[filepath].close();
                // watched[filepath] = undefined;
              } else {
                log(
                  chalk`- {red Warn:} an autoindex file was converted to a non autoindexed file but when trying remove the watcher on that directory it appears it doesn't exist. This should not happen.`
                );
              }
            }
          case "add":
          case "link":
            if (!watchedDirs.includes(dir) && isAutoindexFile(filepath)) {
              log(
                `- new autoindex file detected: ${highlightFilepath(
                  filepath
                )}; watcher started`
              );
              watched[filepath] = setupWatcherDir(dir, [], opts);
              processFiles([filepath], opts);
            }
            break;
          case "unlink":
            log({ dir, filepath, watched: Object.keys(watched) });
            if (watchedDirs.includes(dir)) {
              log(`- the autoindex file ${highlightFilepath(filepath)} has been removed`);
              if (watched[dir]) {
                await watched[dir].close();
                // watched[dir] = undefined;
              } else {
                log(
                  chalk`- {red Warn:} an autoindex file was removed but there was no existing watcher on that directory.`
                );
              }
            }
        }
      };
    };

    for (const evt of ["add", "change", "unlink", "link"]) {
      watcher.on(evt, handlerForAutoIndexFiles(evt));
    }
    log(chalk`{grey - watcher events for autoindex discovery in place}`);
  });

  return watcher;
}

/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _rebuilds_ thes file based on files in
 * the file's current directory
 */
export async function handler(_argv: string[], opts: IDictionary): Promise<void> {
  const monoRepoPackages: false | string[] = getMonoRepoPackages(process.cwd());
  if (monoRepoPackages && !opts.quiet) {
    console.log(
      chalk`{grey - monorepo detected with {yellow ${String(
        monoRepoPackages.length
      )}} packages}`
    );
  }

  const candidateFiles = await globby(["**/index.ts", "**/index.js", "!**/node_modules"]);

  /** those files known to be autoindex files */
  const autoIndexFiles = candidateFiles.filter((fc) => isAutoindexFile(fc));
  if (!opts.quiet) {
    if (candidateFiles.length === autoIndexFiles.length) {
      console.log(
        chalk`- found {yellow ${String(
          candidateFiles.length
        )}} index files, all of which are setup to be autoindexed.\n`
      );
    } else {
      console.log(
        chalk`- found {yellow ${String(
          candidateFiles.length
        )}} {italic candidate} files, of which {yellow ${String(
          autoIndexFiles.length
        )}} have been setup to be autoindexed.\n`
      );
    }
  }

  await processFiles(autoIndexFiles, opts);

  if (opts.watch) {
    /**
     * A dictionary of all active watched directories. Keys are the directory path,
     * values are the watcher object.
     */
    const watchedDirs: IDictionary<FSWatcher> = {};
    setupAutoIndexWatcher(watchedDirs, opts);

    for (const d of autoIndexFiles.map((i) => path.posix.dirname(i)))
      watchedDirs[d] = setupWatcherDir(d, [], opts);

    console.log(
      chalk`- watching {yellow {bold ${String(
        autoIndexFiles.length
      )}}} directories for autoindex changes`
    );
  }
}

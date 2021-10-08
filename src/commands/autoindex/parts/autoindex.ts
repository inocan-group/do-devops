import chalk from "chalk";
import globby from "globby";
import path, { join } from "path";
import { IDictionary } from "common-types";
import { isAutoindexFile, processFiles, watchHandler, WhiteBlackList } from "../private";
import { getMonoRepoPackages } from "~/shared/file";
import { FSWatcher, watch } from "chokidar";
import { emoji, highlightFilepath } from "~/shared/ui";
import { DoDevopsHandler } from "~/@types/command";
import { IAutoindexOptions } from "./options";
import { askForAutoindexConfig } from "~/shared/interactive";
import { getProjectConfig } from "~/shared/config";
import { getPackageJson } from "~/shared/npm";
import { logger } from "~/shared/core";
import { Observations } from "~/@types";

/**
 * Watches for changes in any file where an autoindex file resides
 */
function setupWatcherDir(
  dir: string,
  ignored: string[] = [],
  opts: IDictionary,
  o: Observations,
  scope: WhiteBlackList
) {
  const EVENTS: string[] = ["add", "change", "unlink", "link"];

  const h = watchHandler(dir, opts, o, scope);

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
async function setupAutoIndexWatcher(
  watched: IDictionary<FSWatcher>,
  opts: IDictionary,
  o: Observations,
  scope: WhiteBlackList
) {
  const log = console.log.bind(console);
  const watcher = watch("**/index.[jt]s", {
    ignored: "node_modules/*",
    persistent: true,
    usePolling: true,
    interval: 100,
  });
  watcher.on("error", (e) => {
    log(chalk`{red Error occurred watching for changes to autoindex files:} ${e.message}\n`);
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
              log(`- new autoindex file detected: ${highlightFilepath(filepath)}; watcher started`);
              watched[filepath] = setupWatcherDir(dir, [], opts, o, scope);
              processFiles([filepath], opts, o, scope);
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
export const handler: DoDevopsHandler<IAutoindexOptions> = async ({ opts, observations }) => {
  const log = logger(opts);
  if (opts.config) {
    await askForAutoindexConfig(opts, observations);
    process.exit();
  }
  const projectConfig = getProjectConfig();

  const monoRepoPackages = await getMonoRepoPackages(process.cwd());
  if (monoRepoPackages.length > 0 && !opts.quiet) {
    console.log(
      chalk`- ${emoji.eyeballs} monorepo detected with {yellow ${String(
        monoRepoPackages.length
      )}} packages`
    );
    for (const pkg of monoRepoPackages) {
      console.log(chalk`{gray   - {bold ${pkg.name}} {italic at} {dim ${pkg.path}}}`);
    }
    console.log(
      chalk`- ${emoji.run} will run each package separately based on it's own configuration`
    );
  }

  monoRepoPackages.push({ path: ".", name: getPackageJson(process.cwd()).name });
  const isMonorepo = monoRepoPackages.length > 1;

  for (const repo of monoRepoPackages) {
    const isRoot = isMonorepo && repo.path === ".";
    const name = isRoot ? `${repo.name} (ROOT)` : repo.name;
    if (isMonorepo) {
      log.info(chalk`\n- running {blue autoindex} on repo {bold {yellow ${name}}}\n`);
    }
    const indexGlobs = (projectConfig.autoindex?.indexGlobs || [
      "**/index.ts",
      "**/index.js",
      "**/index.mjs",
      "!**/*.d.ts",
      "!**/node_modules",
      ...(isMonorepo && repo.path === "."
        ? monoRepoPackages.filter((i) => i.path !== ".").map((i) => `!${i.path}/**`)
        : []),
    ]) as readonly string[];

    const candidateFiles = (await globby(indexGlobs, { cwd: join(process.cwd(), repo.path) })).map(
      (i) => join(repo.path, i)
    );
    const bGlob = projectConfig.autoindex?.blacklistGlobs;
    const blacklist = bGlob
      ? (await globby(bGlob, { cwd: join(process.cwd(), repo.path) })).map((i) =>
          join(repo.path, i)
        )
      : [];
    const wGlob = projectConfig.autoindex?.whitelistGlobs;
    const whitelist = wGlob
      ? (await globby(wGlob, { cwd: join(process.cwd(), repo.path) })).map((i) =>
          join(repo.path, i)
        )
      : undefined;

    /** those files known to be autoindex files */
    const autoIndexFiles = candidateFiles.filter((fc) => isAutoindexFile(fc));
    if (candidateFiles.length === autoIndexFiles.length) {
      if (candidateFiles.length > 0) {
        log.info(
          chalk`- found {yellow ${String(
            candidateFiles.length
          )}} index files, {bold {yellow {italic all}}} of which are setup to be autoindexed.`
        );
      }
    } else {
      log.info(
        chalk`- found {yellow ${String(
          candidateFiles.length
        )}} {italic candidate} files, of which {yellow ${String(
          autoIndexFiles.length
        )}} have been setup to be autoindexed.`
      );
      const diff = candidateFiles.length - autoIndexFiles.length;
      if (diff > 0) {
        log.info(chalk`- files {italic not} setup were:`);
        const missing = candidateFiles.filter((i) => !autoIndexFiles.includes(i));
        for (const file of missing) {
          log.info(chalk`{dim   - ${file}}`);
        }
      }
    }

    if (autoIndexFiles.length > 0) {
      await processFiles(autoIndexFiles, opts, observations, { whitelist, blacklist });
    } else {
      log.info(chalk`- No {italic index} files found in this package`);
    }

    if (opts.watch) {
      /**
       * A dictionary of all active watched directories. Keys are the directory path,
       * values are the watcher object.
       */
      const watchedDirs: IDictionary<FSWatcher> = {};
      setupAutoIndexWatcher(watchedDirs, opts, observations, { whitelist, blacklist });

      for (const d of autoIndexFiles.map((i) => path.posix.dirname(i))) {
        watchedDirs[d] = setupWatcherDir(d, [], opts, observations, { whitelist, blacklist });
      }

      console.log(
        chalk`- watching {yellow {bold ${String(
          autoIndexFiles.length
        )}}} directories for autoindex changes`
      );
    }
  }
  if (isMonorepo) {
    log.shout(chalk`\n- ${emoji.party} all repos have been updated with {blue autoindex}`);
  } else {
    log.shout(chalk`- ${emoji.party} {blue autoindex} updated successfully`);
  }
};

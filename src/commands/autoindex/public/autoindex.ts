import chalk from "chalk";
import globby from "globby";
import { IDictionary } from "common-types";
import {
  askHowToHandleMonoRepoIndexing,
  isAutoindexFile,
  processFiles,
  watchHandlers,
} from "../private/index";
import { getMonoRepoPackages, relativePath } from "../../../shared";
import { watch } from "chokidar";
import { posix } from "path";
import { Stats } from "fs";

/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
export async function handler(argv: string[], opts: IDictionary): Promise<void> {
  const monoRepoPackages: false | string[] = getMonoRepoPackages(process.cwd());
  const globInclude = opts.glob ? (opts.glob as string[]).concat("!node_modules") : false;
  const srcDir = opts.dir
    ? posix.join(process.cwd(), opts.dir)
    : monoRepoPackages
    ? posix.join(process.cwd(), "packages/**/src")
    : posix.join(process.cwd(), "src");
  const testDir = monoRepoPackages ? "packages/**/test[s]{0,1}" : `test[s]{0,1}`;
  /** default glob pattern which includes index files in _source_ and _test_ directories */
  let defaultIndexGlob = globInclude || [`${srcDir}/**/index.[tj]s`, `${testDir}/**index.[tj]s`];
  /** the files which may cause a retriggering of the autoindex while watching */
  let pathsToIndexFiles = (await globby(defaultIndexGlob.concat("!**/node_modules"))).filter((fp) =>
    isAutoindexFile(fp)
  );

  /**
   * The packages in a monorepo that _have_ autoindex files
   */
  const pkgsWithIndexFiles = monoRepoPackages
    ? Array.from(
        pathsToIndexFiles.reduce((acc, globPath) => {
          const [_, pkg] = /^.*packages\/(\S*?)\/.*\//.exec(globPath);
          acc.add(pkg);
          return acc;
        }, new Set<string>())
      )
    : false;

  let whichPackage: string;
  if (monoRepoPackages && pkgsWithIndexFiles) {
    whichPackage = opts.all ? "ALL" : await askHowToHandleMonoRepoIndexing(pkgsWithIndexFiles);
    if (whichPackage !== "ALL") {
      pathsToIndexFiles = pathsToIndexFiles.filter((p) => p.includes(`packages/${whichPackage}`));
    }
  }

  const results = await processFiles(pathsToIndexFiles, opts);
  if (!opts.quiet) {
    console.log();
  }

  if (opts.watch) {
    const directoriesWatched: string[] = [];
    const initialWatcherGlob = pathsToIndexFiles.map((p) => {
      const dir = posix.dirname(p);
      directoriesWatched.push(dir);
      return `${posix.join(dir, "*.ts")}`;
    });

    const ignored = pathsToIndexFiles.map((p) => {
      const parts = p.split(/[\/\\]/);
      return relativePath(
        posix.join(...parts.slice(0, parts.length - 1), "node_modules/**"),
        process.cwd()
      );
    });

    const pkgMessage = pkgsWithIndexFiles
      ? pkgsWithIndexFiles && whichPackage !== "ALL"
        ? `; focused only on the "${whichPackage}" package.`
        : chalk`; across {yellow {bold ${String(pkgsWithIndexFiles.length)}}} packages`
      : "";
    const trailingMsg = chalk`\n- watcher has started watching {bold {yellow ${String(
      pathsToIndexFiles.length
    )}}} directories${pkgMessage}`;

    setupWatcher(pkgMessage + trailingMsg, initialWatcherGlob, ignored, [], opts);

    const watchForNewIndexes = watch(["src/**/index.ts", "src/**/index.js", "!node_modules"], {
      persistent: true,
      usePolling: true,
      interval: 100,
    });

    watchForNewIndexes.on("ready", (...args: any[]) => {
      console.log(chalk`{grey - watching for new directories with an autoindex file}`);

      const addDirWhenFound = (path: string, stats: Stats) => {
        if (isAutoindexFile(path)) {
          const dir = posix.dirname(path);
          if (directoriesWatched.includes(dir)) {
            // ignore
          } else {
            directoriesWatched.push(dir);
            console.log(chalk`- new {yellow {bold autoindex}} file found: {italic {dim ${path}}}`);

            processFiles([path], { ...opts, quiet: true });
            setupWatcher(
              chalk`\n- Adding watcher to the files in the {blue ${relativePath(dir)}} directory`,
              [dir],
              [
                posix.join(dir, "index.ts"),
                posix.join(dir, "index.js"),
                posix.join(dir, "private.ts"),
                posix.join(dir, "private.js"),
              ],
              [],
              opts
            );
          }
        }
      };

      watchForNewIndexes.on("add", addDirWhenFound);
      watchForNewIndexes.on("change", addDirWhenFound);
    });
  }
}

const EVENTS: string[] = ["add", "change", "unlink", "link"];
type Event = keyof typeof EVENTS;

function setupWatcher(
  message: string,
  paths: string[],
  ignored: string[] = [],
  events: string[] = [],
  opts: IDictionary
) {
  const log = console.log.bind(console);
  const h = watchHandlers(paths, log, opts);
  const allEvents = events.length === 0;

  const watcher = watch([...paths, "!node_modules/"], {
    ignored,
    persistent: true,
    usePolling: true,
    interval: 100,
  });
  watcher.on("ready", () => {
    if (message) console.log(message);
    watcher.on("error", (e) => {
      log(`Error occurred: ${e.message}`);
    });

    EVENTS.forEach((evt) => {
      if (allEvents || events.includes(evt)) {
        watcher.on(
          evt,
          h((evt.includes("Dir") ? `${evt}ed directory` : `${evt}ed`).replace("ee", "e"))
        );
      }
    });
  });
}

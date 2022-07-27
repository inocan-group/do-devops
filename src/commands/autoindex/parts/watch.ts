import chalk from "chalk";
import { spawn } from "node:child_process";
import w from "chokidar";
import { existsSync } from "node:fs";
import path from "pathe";
import { Options } from "~/@types";
import { fileHasExports } from "~/shared/ast";
import { ILogger, logger } from "~/shared/core/logger";
import { emoji, highlightFilepath } from "~/shared/ui";
import { isAutoindexFile } from "../private/util";
import { IAutoindexOptions } from "./options";

export type IAutoindexWatchlist = {
  /** name of the repo */
  name: string;
  /** relative directory off of CWD */
  dir: string;
  /** glob patterns used for matching autoindex files */
  indexGlobs: string[];
  /** the whitelist of glob patterns */
  whiteGlobs: string[];
  blackGlobs: string[];
};

const deferredFiles = new Set<string>();

function recheck(autoindexFile: string, log: ILogger): Promise<boolean> {
  const cmd = ["dd", "autoindex", "--quiet", autoindexFile];
  try {
    const check = spawn("npx", cmd, { stdio: "inherit", cwd: process.cwd() });
    check.on("error", (error: Error) => {
      throw error;
    });
    const promise = new Promise<boolean>((resolve) => {
      check.on("exit", () => resolve(true));
      check.on("disconnect", () => resolve(true));
      check.on("close", () => resolve(true));
    });
    return promise;
  } catch (error) {
    log.shout(
      `- ${emoji.poop} problems re-running autoindex on ${highlightFilepath(autoindexFile)}: ${
        (error as Error).message
      }`
    );
    return Promise.resolve(false);
  }
}

function recheckAutoindexFile(changedFile: string, log: ILogger) {
  const dir = path.dirname(changedFile);
  const autoindexFile = existsSync(path.join(process.cwd(), dir, "/index.ts"))
    ? path.join(dir, "/index.ts")
    : existsSync(path.join(process.cwd(), dir, "/index.js"))
    ? path.join(dir, "/index.js")
    : undefined;
  if (autoindexFile) {
    recheck(autoindexFile, log);
  } else {
    log.info(
      chalk`- ${emoji.confused} there was a problem identifying the right {italic autoindex} file for {blue ${changedFile}}`
    );
  }
}

/** watcher for whitelisted files */
function whitewatcher(repo: IAutoindexWatchlist, op: string, log: ILogger) {
  return (file: string) => {
    switch (op) {
      case "add":
        log.info(
          chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
            repo.name
          }} {italic added the file }${highlightFilepath(file)}}`
        );
        if (fileHasExports(path.join(process.cwd(), file))) {
          recheckAutoindexFile(file, log);
        } else {
          deferredFiles.add(file);
          log.info(
            chalk`{dim - {bold Autoindex:} the file has no {italic exports} yet so deferring update}`
          );
        }
        break;
      case "unlink":
        log.info(
          chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
            repo.name
          }} {italic removed the file }${highlightFilepath(file)}}`
        );
        recheckAutoindexFile(file, log);
        break;
      case "changed":
        const hasExports = fileHasExports(path.join(process.cwd(), file));
        const wasDeferred = deferredFiles.has(file);
        if (hasExports && wasDeferred) {
          log.info(
            chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
              repo.name
            }} {italic changed }${highlightFilepath(file)} {italic which now has exports}}`
          );
          deferredFiles.delete(file);
          recheckAutoindexFile(file, log);
        } else if (!hasExports) {
          log.info(
            chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
              repo.name
            }} {italic changed }${highlightFilepath(file)} {italic and no longer has exports}}`
          );
          recheckAutoindexFile(file, log);
        }
        break;
      default:
        log.info(
          chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
            repo.name
          }} {italic did "${op}" to }${highlightFilepath(file)}}`
        );
    }
  };
}

function getParentIndex(file: string) {
  const dir = path.dirname(file).split("/");
  const ts = path.join(dir.slice(0, -1).join("/"), "index.ts");
  const js = path.join(dir.slice(0, -1).join("/"), "index.js");
  return existsSync(ts) ? ts : existsSync(js) ? js : undefined;
}

function indexwatcher(repo: IAutoindexWatchlist, op: string, log: ILogger) {
  return (file: string) => {
    switch (op) {
      case "add":
        if (isAutoindexFile(file)) {
          log.info(
            chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
              repo.name
            }} {italic added a new autoindex file }${highlightFilepath(file)}}`
          );
          recheck(file, log).then((successful: boolean) => {
            if (successful) {
              const parentIndex = getParentIndex(file);
              if (parentIndex) {
                recheck(parentIndex, log);
              }
            } else {
              log.info(
                chalk`{dim {red - autoindex update failed to update ${highlightFilepath(file)}}}`
              );
            }
          });
        }
        break;
      case "unlink":
        log.info(
          chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
            repo.name
          }} {italic removed an autoindex file }${highlightFilepath(file)}}`
        );
        const parentIndex = getParentIndex(file);
        if (parentIndex) {
          recheck(parentIndex, log);
        }
        break;

      case "change":
        log.info(
          chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
            repo.name
          }} {italic changed an autoindex file }${highlightFilepath(file)}}`
        );
        recheck(file, log);
        break;

      default:
        log.info(`Unexpected operation [${op}] passed to the indexwatcher`);
    }
  };
}

export function watch(watchList: IAutoindexWatchlist[], opts: Options<IAutoindexOptions>) {
  const log = logger(opts);
  log.info();
  for (const repo of watchList) {
    log.info(
      chalk`- watching {blue ${repo.name}} ${watchList.length > 1 ? "package" : "repo"} for changes`
    );
    const whitelist = w.watch(repo.whiteGlobs, {
      ignored: [...repo.blackGlobs, ...repo.indexGlobs, "node_modules/**"],
      cwd: path.join(process.cwd(), repo.dir),
    });
    whitelist.on("ready", () => {
      whitelist.on("add", whitewatcher(repo, "add", log));
      whitelist.on("unlink", whitewatcher(repo, "unlink", log));
      whitelist.on("change", whitewatcher(repo, "changed", log));
      whitelist.on("remove", whitewatcher(repo, "remove", log));
    });
    const indexlist = w.watch(repo.indexGlobs, {
      ignored: repo.blackGlobs,
      cwd: path.join(process.cwd(), repo.dir),
    });
    indexlist.on("ready", () => {
      indexlist.on("add", indexwatcher(repo, "add", log));
      indexlist.on("unlink", indexwatcher(repo, "unlink", log));
      indexlist.on("change", indexwatcher(repo, "change", log));
    });
  }

  log.info();
}

/**
 * Watches for changes in any file where an autoindex file resides
 */
// function setupWatcherDir(
//   dir: string,
//   ignored: string[] = [],
//   opts: IDictionary,
//   o: Observations,
//   scope: WhiteBlackList
// ) {
//   const EVENTS: string[] = ["add", "change", "unlink", "link"];

//   const h = watchHandler(dir, opts, o, scope);

//   const watcher = watch(dir, {
//     ignored,
//     persistent: true,
//     usePolling: true,
//     interval: 100,
//   });
//   watcher.on("ready", () => {
//     watcher.on("error", (e) => {
//       console.log(chalk`{red Error occurred watching "${dir}":} ${e.message}\n`);
//     });

//     for (const evt of EVENTS) {
//       watcher.on(
//         evt,
//         h((evt.includes("Dir") ? `${evt}ed directory` : `${evt}ed`).replace("ee", "e"))
//       );
//     }
//   });

//   return watcher;
// }

/**
 * Watch for changes to autoindex files and add/remove file watchers in response
 */
// async function setupAutoIndexWatcher(
//   watched: IDictionary<FSWatcher>,
//   opts: IDictionary,
//   o: Observations,
//   scope: WhiteBlackList
// ) {
//   const log = console.log.bind(console);
//   const watcher = watch("**/index.[jt]s", {
//     ignored: "node_modules/*",
//     persistent: true,
//     usePolling: true,
//     interval: 100,
//   });
//   watcher.on("error", (e) => {
//     log(chalk`{red Error occurred watching for changes to autoindex files:} ${e.message}\n`);
//   });

//   watcher.on("ready", () => {
//     const handlerForAutoIndexFiles = (evt: string) => {
//       return async (filepath: string) => {
//         if (!/(index|private)\.[jt]s/.test(filepath)) {
//           return;
//         }

//         const watchedDirs = Object.keys(watched);
//         const dir = path.dirname(filepath);

//         switch (evt) {
//           case "change":
//             if (watchedDirs.includes(dir) && !isAutoindexFile(filepath)) {
//               log(
//                 chalk`- index file ${highlightFilepath(
//                   filepath
//                 )} is no longer an {italic autoindex} file`
//               );
//               if (watched[filepath]) {
//                 await watched[filepath].close();
//                 // watched[filepath] = undefined;
//               } else {
//                 log(
//                   chalk`- {red Warn:} an autoindex file was converted to a non autoindexed file but when trying remove the watcher on that directory it appears it doesn't exist. This should not happen.`
//                 );
//               }
//             }
//           case "add":
//           case "link":
//             if (!watchedDirs.includes(dir) && isAutoindexFile(filepath)) {
//               log(`- new autoindex file detected: ${highlightFilepath(filepath)}; watcher started`);
//               watched[filepath] = setupWatcherDir(dir, [], opts, o, scope);
//               processFiles([filepath], opts, o, scope);
//             }
//             break;
//           case "unlink":
//             log({ dir, filepath, watched: Object.keys(watched) });
//             if (watchedDirs.includes(dir)) {
//               log(`- the autoindex file ${highlightFilepath(filepath)} has been removed`);
//               if (watched[dir]) {
//                 await watched[dir].close();
//                 // watched[dir] = undefined;
//               } else {
//                 log(
//                   chalk`- {red Warn:} an autoindex file was removed but there was no existing watcher on that directory.`
//                 );
//               }
//             }
//         }
//       };
//     };

//     for (const evt of ["add", "change", "unlink", "link"]) {
//       watcher.on(evt, handlerForAutoIndexFiles(evt));
//     }
//     log(chalk`{grey - watcher events for autoindex discovery in place}`);
//   });

//   return watcher;
// }

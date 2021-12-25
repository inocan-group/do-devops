import chalk from "chalk";
import { spawn } from "child_process";
import w from "chokidar";
import { existsSync } from "fs";
import path from "path";
import { Options } from "~/@types";
import { ILogger, logger } from "~/shared/core/logger";
import { emoji, highlightFilepath } from "~/shared/ui";
import { IAutoindexOptions } from "./options";

export type IAutoindexWatchlist = {
  /** name of the repo */
  name: string;
  /** relative directory off of CWD */
  dir: string;
  /** glob patterns used for matching autoindex files */
  indexglobs: string[];
  /** the whitelist of glob patterns */
  whiteglobs: string[];
  blackglobs: string[];
};

function whitewatcher(info: IAutoindexWatchlist, op: string, log: ILogger) {
  return (file: string) => {
    switch (op) {
      case "add":
        log.info(
          chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
            info.name
          }} {italic added the file }${highlightFilepath(file)}}`
        );
      case "unlink":
        log.info(
          chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
            info.name
          }} {italic removed the file }${highlightFilepath(file)}}`
        );
        const dir = path.posix.dirname(file);
        const autoindexFile = existsSync(path.posix.join(process.cwd(), dir, "/index.ts"))
          ? path.posix.join(process.cwd(), dir, "/index.ts")
          : existsSync(path.posix.join(process.cwd(), dir, "/index.js"))
          ? path.posix.join(process.cwd(), dir, "/index.js")
          : undefined;
        if (autoindexFile) {
          spawn(`dd autoindex --quiet ${file}`, { stdio: "inherit", cwd: process.cwd() });
        } else {
          log.info(
            chalk`- ${emoji.confused} there was a problem identifying the right {italic autoindex} file for {blue ${file}}`
          );
        }
        break;
      default:
        log.info(
          chalk`- {bold Autoindex:} {dim {italic repo} {blue ${
            info.name
          }} {italic did "${op}" to }${highlightFilepath(file)}}`
        );
    }
  };
}

export function watch(watchList: IAutoindexWatchlist[], opts: Options<IAutoindexOptions>) {
  const log = logger(opts);
  for (const repo of watchList) {
    log.info(chalk`- watching {blue ${repo.name}} repo for changes`);
    const whitelist = w.watch(repo.whiteglobs, {
      ignored: [...repo.blackglobs, ...repo.indexglobs, "node_modules/**"],
      cwd: path.posix.join(process.cwd(), repo.dir),
    });
    whitelist.on("ready", () => {
      whitelist.on("add", whitewatcher(repo, "add", log));
      whitelist.on("unlink", whitewatcher(repo, "unlink", log));
      whitelist.on("remove", whitewatcher(repo, "remove", log));
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
//         const dir = path.posix.dirname(filepath);

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

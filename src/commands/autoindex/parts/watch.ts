import chalk from "chalk";
import { spawn } from "node:child_process";
import w, { WatchOptions } from "chokidar";
import { existsSync } from "node:fs";
import { dirname, join } from "pathe";
import { Options } from "src/@types";
import { fileHasExports } from "src/shared/ast";
import { ILogger, logger } from "src/shared/core/logger";
import { emoji, highlightFilepath } from "src/shared/ui";
import { isAutoindexFile } from "../private/util";
import { IAutoindexOptions } from "./options";
import { AutoindexGroupDefinition } from "./getGlobs";
import { cwd } from "node:process";

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
  const dir = dirname(changedFile);
  const autoindexFile = existsSync(join(process.cwd(), dir, "/index.ts"))
    ? join(dir, "/index.ts")
    : existsSync(join(process.cwd(), dir, "/index.js"))
    ? join(dir, "/index.js")
    : undefined;
  if (autoindexFile) {
    recheck(autoindexFile, log);
  } else {
    log.info(
      `- ${emoji.confused} there was a problem identifying the right {italic autoindex} file for {blue ${changedFile}}`
    );
  }
}

/** watcher for whitelisted files */
function contentWatcher(group: AutoindexGroupDefinition, op: string, log: ILogger) {
  return (file: string) => {
    switch (op) {
      case "add": {
        log.info(
          `- ${chalk.bold("Autoindex:")} ${chalk.dim.italic(" repo ")} ${chalk.blue(group.name)} {italic added the file }${highlightFilepath(file)}}`
        );
        if (fileHasExports(join(process.cwd(), file))) {
          recheckAutoindexFile(file, log);
        } else {
          deferredFiles.add(file);
          log.info(
            chalk.dim(`- ${chalk.bold("Autoindex:")} the file has no {italic exports} yet so deferring update`)
          );
        }
        break;
      }
      case "unlink": {
        log.info(
          `- ${chalk.bold("Autoindex:")} ${chalk.dim.italic(" repo ")} ${chalk.blue(group.name)} {italic removed the file }${highlightFilepath(file)}}`
        );
        recheckAutoindexFile(file, log);
        break;
      }
      case "changed": {
        const hasExports = fileHasExports(join(process.cwd(), file));
        const wasDeferred = deferredFiles.has(file);
        if (hasExports && wasDeferred) {
          log.info(
            `- ${chalk.bold("Autoindex:")} ${chalk.dim.italic(" repo ")} {blue ${
              group.name
            }} {italic changed }${highlightFilepath(file)} {italic which now has exports}}`
          );
          deferredFiles.delete(file);
          recheckAutoindexFile(file, log);
        } else if (!hasExports) {
          log.info(
            `- ${chalk.bold("Autoindex:")} ${chalk.dim.italic(" repo ")} {blue ${
              group.name
            }} {italic changed }${highlightFilepath(file)} {italic and no longer has exports}}`
          );
          recheckAutoindexFile(file, log);
        }
        break;
      }
      default: {
        log.info(
          `- ${chalk.bold("Autoindex:")} ${chalk.dim.italic(" repo ")} ${chalk.blue(group.name)} {italic did "${op}" to }${highlightFilepath(file)}}`
        );
      }
    }
  };
}

function getParentIndex(file: string) {
  const dir = dirname(file).split("/");
  const ts = join(dir.slice(0, -1).join("/"), "index.ts");
  const js = join(dir.slice(0, -1).join("/"), "index.js");
  return existsSync(ts) ? ts : existsSync(js) ? js : undefined;
}

function idxWatcher(group: AutoindexGroupDefinition, op: string, log: ILogger) {
  return (file: string) => {
    switch (op) {
      case "add": {
        if (isAutoindexFile(file)) {
          log.info(
            `- ${chalk.bold("Autoindex:")} ${chalk.dim.italic(" repo ")} {blue ${
              group.name
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
                chalk.dim.red` - autoindex update failed to update ${highlightFilepath(file)}`
              );
            }
          });
        }
        break;
      }
      case "unlink": {
        log.info(
          `- ${chalk.bold("Autoindex:")} ${chalk.italic("repo")} ${chalk.blue(group.name)} ${chalk.italic("removed an autoindex file ")}${highlightFilepath(file)}}""`
        );
        const parentIndex = getParentIndex(file);
        if (parentIndex) {
          recheck(parentIndex, log);
        }
        break;
      }

      case "change": {
        log.info(
          `- ${chalk.bold("Autoindex:")} ${chalk.dim.italic(" repo ")} ${chalk.blue(group.name)} ${chalk.italic("changed an autoindex file ")}${highlightFilepath(file)}}`
        );
        recheck(file, log);
        break;
      }

      default: {
        log.info(`Unexpected operation [${op}] passed to the index watcher`);
      }
    }
  };
}

const groups: AutoindexGroupDefinition[] = [];

function addWatcher(
  group: AutoindexGroupDefinition,
  opts: WatchOptions,
  type: "index" | "content",
  log: ILogger
) {
  const watcher = w.watch(type === "index" ? group.indexGlobs : group.contentGlobs, opts);

  switch (type) {
    case "content": {
      watcher.on("ready", () => {
        watcher.on("add", contentWatcher(group, "add", log));
        watcher.on("unlink", contentWatcher(group, "unlink", log));
        watcher.on("change", contentWatcher(group, "changed", log));
        watcher.on("remove", contentWatcher(group, "remove", log));
      });
      break;
    }
    case "index": {
      watcher.on("ready", () => {
        watcher.on("add", idxWatcher(group, "add", log));
        watcher.on("unlink", idxWatcher(group, "unlink", log));
        watcher.on("change", idxWatcher(group, "change", log));
      });
      break;
    }
  }

  return watcher;
}

export function watch(group: AutoindexGroupDefinition, opts: Options<IAutoindexOptions>) {
  const log = logger(opts);
  // add watcher for index files
  const indexWatcher = addWatcher(
    group,
    {
      cwd: join(cwd(), group.path),
    },
    "index",
    log
  );
  // add watcher for content files
  const contentWatcher = addWatcher(
    group,
    {
      cwd: join(cwd(), group.path),
    },
    "content",
    log
  );

  groups.push({ ...group, indexWatcher, contentWatcher });

  log.info();
  log.info(`Watching ${group.name}:`);
  log.info(` - this includes {yellow ${group.indexFiles.length}} index files`);
  log.info(` - and {yellow ${group.contentFiles.length}} content files`);
  log.info();
}

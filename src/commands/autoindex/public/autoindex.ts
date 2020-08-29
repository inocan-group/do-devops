import * as chalk from "chalk";
import * as globby from "globby";

import { IDictionary, wait } from "common-types";
import { askHowToHandleMonoRepoIndexing, processFiles } from "../private/index";

import { getMonoRepoPackages } from "../../../shared";
import { join } from "path";

import { FSWatcher, watch } from "chokidar";

/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
export async function handler(argv: string[], opts: IDictionary): Promise<void> {
  const monoRepoPackages: false | string[] = getMonoRepoPackages(process.cwd());
  const globInclude = opts.glob ? (opts.glob as string[]).concat("!node_modules") : false;
  const srcDir = opts.dir
    ? join(process.cwd(), opts.dir)
    : monoRepoPackages
    ? join(process.cwd(), "packages/**/src")
    : join(process.cwd(), "src");

  let globPattern = globInclude || [
    `${srcDir}/**/index.ts`,
    `${srcDir}/**/index.js`,
    `${srcDir}/**/private.ts`,
    `${srcDir}/**/private.js`,
  ];

  let watcherReady: boolean = false;
  let pathsToIndexFiles = await globby(globPattern.concat("!**/node_modules"));
  const pkgsWithIndexFiles = monoRepoPackages
    ? Array.from(
        pathsToIndexFiles.reduce((acc, globPath) => {
          const [_, pkg] = /^.*packages\/(\S*?)\/.*\//.exec(globPath);
          acc.add(pkg);
          return acc;
        }, new Set<string>())
      )
    : false;
  if (monoRepoPackages && pkgsWithIndexFiles) {
    const answer = await askHowToHandleMonoRepoIndexing(pkgsWithIndexFiles);
    if (answer !== "ALL") {
      pathsToIndexFiles = pathsToIndexFiles.filter((p) => p.includes(`packages/${answer}`));
    }
  }

  // explict run of autoindex (not watch)

  const results = await processFiles(pathsToIndexFiles, opts);
  if (!opts.quiet) {
    console.log();
  }

  if (opts.watch) {
    let watcher: FSWatcher;
    const log = console.log.bind(console);
    if (monoRepoPackages) {
      if (!pkgsWithIndexFiles) {
        console.log(
          chalk`- this monorepo has NO packages which have autoindex files so no watching is required!`
        );
        process.exit();
      }
      console.log(chalk`- will watch TS files in {italic packages} which have autoindex files,`);
      console.log(
        chalk`- this includes the following packages:\n  {dim - ${pkgsWithIndexFiles.join("\n  ")}}`
      );
      const watchPaths = pkgsWithIndexFiles.map((pkg) => `./packages/${pkg}/src/*.ts`);
    } else {
      watcher = watch(srcDir + "/**/*.ts", {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
      });
    }
    watcher.on("ready", () => {
      log(
        chalk`- autoindex {italic watcher} has {bold {green started}}; monitoring {blue ${srcDir}} for changes`
      );
      watcherReady = true;
      watcher.on("add", async (path) => {
        console.log(chalk`- {italic file added}, re-running autoindex`);

        processFiles(paths, { ...opts, quiet: true }).catch((e: Error) =>
          log(chalk`Error re-running autoindex (on {italic add} event): ${e.message}\n`, e.stack)
        );
      });
      watcher.on("unlink", async (path) => {
        console.log(chalk`- {italic file removed}, re-running autoindex`);

        processFiles(paths, { ...opts, quiet: true }).catch((e: Error) =>
          log(chalk`Error re-running autoindex (on {italic unlink} event): ${e.message}\n`, e.stack)
        );
      });
      watcher.on("addDir", async (path) => {
        processFiles(paths, { ...opts, quiet: true }).catch((e: Error) =>
          log(chalk`Error re-running autoindex (on {italic addDir} event): ${e.message}\n`, e.stack)
        );
      });
      watcher.on("unlinkDir", async (path) => {
        processFiles(paths, { ...opts, quiet: true }).catch((e: Error) =>
          log(
            chalk`Error re-running autoindex (on {italic unlinkDir} event): ${e.message}\n`,
            e.stack
          )
        );
      });
    });

    watcher.on("error", (e) => {
      log(`- An error occurred while watching autoindex paths: ${e.message}`);
    });
  }
}

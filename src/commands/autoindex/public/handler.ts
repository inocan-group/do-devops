import * as chalk from "chalk";
import * as globby from "globby";

import { IDictionary, wait } from "common-types";
import { askHowToHandleMonoRepoIndexing, processFiles } from "../private/index";

import { getMonoRepoPackages } from "../../../shared";
import { join } from "path";
import { watch } from "chokidar";

/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
export async function handler(argv: string[], opts: IDictionary): Promise<void> {
  const globInclude = opts.glob ? (opts.glob as string[]).concat("!node_modules") : false;

  const monoRepoPackages: false | string[] = getMonoRepoPackages(process.cwd());

  if (monoRepoPackages) {
    const response: string = await askHowToHandleMonoRepoIndexing(monoRepoPackages);
    if (response === "ALL") {
      for await (const pkg of monoRepoPackages) {
        if (!opts.quiet) {
          console.log(chalk`Running {bold autoindex} for the {green ${pkg}}:`);
        }
        await handler(argv, { ...opts, dir: join(opts.dir || process.env.PWD, "packages", pkg), withinMonorepo: true });
      }
      return;
    } else {
      return handler(argv, {
        ...opts,
        dir: join(opts.dir || process.env.PWD, "packages", response),
        withinMonorepo: true,
      });
    }
  }

  const srcDir = opts.dir ? join(process.cwd(), opts.dir) : join(process.cwd(), "src");
  const globPattern = globInclude || [
    `${srcDir}/**/index.ts`,
    `${srcDir}/**/index.js`,
    `${srcDir}/**/private.ts`,
    `${srcDir}/**/private.js`,
  ];

  if (opts.watch) {
    console.log();

    const watcher = watch(srcDir + "/**/*", {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });
    const log = console.log.bind(console);
    watcher.on("ready", () => {
      log(chalk`- autoindex {italic watcher} has {bold {green started}} monitoring {blue ${srcDir}} for changes`);
    });
    watcher.on("add", async (path) => processFiles([path], { ...opts, quiet: true }));
    watcher.on("unlink", async (path) => processFiles([path], { ...opts, quiet: true }));
    watcher.on("addDir", async (path) => processFiles([path], { ...opts, quiet: true }));
    watcher.on("unlinkDir", async (path) => processFiles([path], { ...opts, quiet: true }));
    watcher.on("error", (e) => {
      log(`- An error occurred: ${e.message}`);
    });
  } else {
    const paths = await globby(globPattern.concat("!node_modules"));
    const results = await processFiles(paths, opts);
    if (!opts.quiet) {
      console.log();
    }
  }
}

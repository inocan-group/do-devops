import * as chalk from "chalk";
import * as globby from "globby";

import { askHowToHandleMonoRepoIndexing, processFiles } from "../private/index";

import { IDictionary } from "common-types";
import { getMonoRepoPackages } from "../../../shared";
import { join } from "path";

/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
export async function handler(argv: string[], opts: IDictionary): Promise<void> {
  const dir = opts.dir || process.env.PWD;
  const globInclude = opts.glob;

  const monoRepoPackages: false | string[] = getMonoRepoPackages(dir);

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

  const srcDir = join(dir, "src");

  const paths = await globby([
    `${srcDir}/**/index.ts`,
    `${srcDir}/**/index.js`,
    `${srcDir}/**/private.ts`,
    `${srcDir}/**/private.js`,
    "!node_modules",
  ]);

  const results = await processFiles(paths, opts);
  if (!opts.quiet) {
    console.log();
  }
}

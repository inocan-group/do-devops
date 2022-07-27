/* eslint-disable unicorn/no-process-exit */
/* eslint-disable unicorn/no-await-expression-member */
import chalk from "chalk";
import globby from "globby";
import { join } from "pathe";
import { getMonoRepoPackages } from "~/shared/file";
import { emoji, highlightFilepath } from "~/shared/ui";
import { DoDevopsHandler } from "~/@types/command";
import { IAutoindexOptions } from "./options";
import { askForAutoindexConfig } from "~/shared/interactive";
import { getProjectConfig } from "~/shared/config";
import { getPackageJson } from "~/shared/npm";
import { logger } from "~/shared/core";
import { isAutoindexFile, processFiles } from "../private";
import { IAutoindexWatchlist, watch } from "./watch";

export const REQUIRED_BLACKLIST = ["**node_modules/**"];

export const INDEX_LIST_DEFAULTS = ["**/index.ts", "**/index.js", "**/index.mjs", "**/index.cjs"];
export const WHITE_LIST_DEFAULTS = ["src/**/*.ts", "src/**/*.vue", "!node_modules"];
export const BLACK_LIST_DEFAULTS = [
  "src/**/*.d.ts",
  "packages/**/*",
  "dist/**",
  "lib/**",
  ".webpack/**",
  "node_modules/**",
];

/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _rebuilds_ thes file based on files in
 * the file's current directory
 */
export const handler: DoDevopsHandler<IAutoindexOptions> = async ({ opts, observations, argv }) => {
  let projectConfig = getProjectConfig();
  // the sfc flag on CLI is inverted logically
  opts = { ...opts, sfc: opts.sfc === false ? false : true, explicitFiles: argv.length > 0 };

  const log = logger(opts);
  if (opts.config) {
    await askForAutoindexConfig(opts, observations);
    process.exit();
  }

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
    console.log(chalk`- ⚡️ will run each package separately based on it's own configuration`);
  }

  monoRepoPackages.push({ path: ".", name: getPackageJson(process.cwd()).name });
  const isMonorepo = monoRepoPackages.length > 1;
  const watchlist: IAutoindexWatchlist[] = [];

  // ITERATE OVER EACH REPO
  for (const repo of monoRepoPackages) {
    const isRoot = isMonorepo && repo.path === ".";
    if (isMonorepo) {
      projectConfig = getProjectConfig(repo.path);
      opts = opts.sfc === undefined ? { ...opts, sfc: projectConfig.autoindex?.sfc } : opts;
    }
    const name = isRoot ? `${repo.name} (ROOT)` : repo.name;
    if (isMonorepo) {
      log.info(chalk`\n- ${emoji.run} running {blue autoindex} on repo {bold {yellow ${name}}}`);
    }

    const prepList = async (globs: string[]) => {
      return (
        await globby(globs, {
          cwd: join(process.cwd(), repo.path),
          onlyFiles: true,
        })
      ).map((i) => join(repo.path, i));
    };
    const indexGlobs = projectConfig.autoindex?.indexGlobs || INDEX_LIST_DEFAULTS;
    const hasExplicitFiles = argv?.length > 0 && (await prepList(indexGlobs)).includes(argv[0]);
    if (!hasExplicitFiles && argv?.length > 0) {
      log.shout(
        chalk`- ${emoji.confused} you have added ${
          argv?.length > 1 ? "files" : "a file"
        } to your autoindex file which doesn't appear to be a valid autoindex file ({italic {dim aka, it doesn't fit your index glob patterns}})`
      );
      log.shout(chalk`- files: ${argv?.map((i) => highlightFilepath(i)).join(", ")}`);
      process.exit();
    }
    if (hasExplicitFiles) {
      log.info(chalk`{dim - Using explicit autoindex files passed into CLI}`);
    }

    const blackGlobs = [
      ...(projectConfig.autoindex?.blacklistGlobs || BLACK_LIST_DEFAULTS),
      ...REQUIRED_BLACKLIST,
    ];
    const blacklist = await prepList(blackGlobs);

    const indexList = hasExplicitFiles
      ? argv
      : (await prepList(indexGlobs)).filter((i) => !blacklist.includes(i));

    const whiteGlobs = [...(projectConfig.autoindex?.whitelistGlobs || WHITE_LIST_DEFAULTS)];
    const whitelist = (await prepList(whiteGlobs)).filter((w) => !indexList.includes(w));

    /** those files known to be autoindex files */
    const autoIndexFiles = indexList.filter((fc) => isAutoindexFile(fc));
    if (indexList.length === autoIndexFiles.length) {
      if (indexList.length > 0) {
        log.info(
          chalk`- found {yellow ${String(
            indexList.length
          )}} index files, {bold {yellow {italic all}}} of which are setup to be auto-indexed.\n`
        );
      }
    } else {
      log.info(
        chalk`- found {yellow ${String(
          indexList.length
        )}} {italic candidate} files, of which {yellow ${String(
          autoIndexFiles.length
        )}} have been setup to be auto-indexed.`
      );
      const diff = indexList.length - autoIndexFiles.length;
      if (diff > 0) {
        log.info(chalk`- files {italic not} setup were:`);
        const missing = indexList.filter((i) => !autoIndexFiles.includes(i));
        for (const file of missing) {
          log.info(chalk`{dim   - ${file}}`);
        }
      }
      console.log();
    }

    if (autoIndexFiles.length > 0) {
      await processFiles(autoIndexFiles, opts, observations, {
        whitelist,
        blacklist,
      });
    } else {
      log.info(chalk`- ${emoji.confused} no {italic index} files found in this package`);
    }

    if (opts.watch) {
      watchlist.push({
        name: repo.name,
        dir: repo.path,
        indexGlobs,
        whiteGlobs,
        blackGlobs,
      });
    }
  }

  if (opts.watch) {
    watch(watchlist, opts);
  } else {
    if (isMonorepo) {
      log.shout(chalk`\n- ${emoji.party} all repos have been updated with {blue autoindex}`);
    } else {
      log.shout(chalk`- ${emoji.party} {blue autoindex} job updated successfully`);
    }
  }
};

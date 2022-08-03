/* eslint-disable unicorn/no-process-exit */
/* eslint-disable unicorn/no-await-expression-member */
import chalk from "chalk";
import { dirname } from "pathe";
import { emoji } from "src/shared/ui";
import { DoDevopsHandler } from "src/@types/command";
import { IAutoindexOptions } from "./options";
import { askForAutoindexConfig } from "src/shared/interactive";
import { logger } from "src/shared/core";
import { processFiles } from "../private";
import { watch } from "./watch";
import { getPackageJson } from "src/shared/npm/package-json";
import { exit } from "node:process";
import { AutoindexGroupDefinition, getContent, getIndex } from "./getGlobs";
import { getMonoRepoPackages, getSubdirectories } from "src/shared/file";

/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _rebuilds_ these file based on files in
 * the file's current directory
 */
export const handler: DoDevopsHandler<IAutoindexOptions> = async ({ opts, observations, argv }) => {
  // the sfc flag on CLI is inverted logically
  opts = {
    ...opts,
    sfc: opts.sfc === false ? false : true,
    explicitFiles: (argv?.length || 0) > 0,
  };

  const log = logger(opts);
  if (opts.config) {
    await askForAutoindexConfig(opts, observations);
    process.exit();
  }

  const kind = opts.explicitFiles
    ? "explicit-files"
    : observations.has("monorepo")
    ? "monorepo"
    : "repo";

  /**
   * The "packages" we will use to iterate over if no explicit
   * index files are provided.
   */
  const groups: AutoindexGroupDefinition[] = [];

  switch (kind) {
    case "explicit-files":
      log.info(
        chalk`- you have passed in specific {italic index} files to evaluate [{dim ${argv.length}}]; we will group by each file ...`
      );
      // note: it seems argv params -- if in a "glob" format are automatically converted
      // to literal filenames
      for (const file of argv) {
        const baseDir = dirname(file);
        const indexFiles = [file];
        const { contentGlobs, contentFiles } = await getContent(baseDir, opts);

        const pkg: AutoindexGroupDefinition = {
          kind: "explicit-files",
          path: ".",
          name: `index file: ${file}`,
          indexGlobs: [file],
          indexFiles,
          contentGlobs,
          contentFiles,
          nonAutoindexFiles: [],
        };

        groups.push(pkg);
      }
      break;
    case "repo":
      const { indexGlobs, indexFiles, nonAutoindexFiles } = await getIndex(".", opts);
      const { contentGlobs, contentFiles } = await getContent(".", opts);

      log.info(chalk`{dim - no monorepo was detected so will run just once using glob patterns}`);

      groups.push({
        kind: "repo",
        path: ".",
        name: getPackageJson(process.cwd()).name || "unnamed",
        contentGlobs,
        indexGlobs,
        contentFiles,
        indexFiles,
        nonAutoindexFiles,
      });
      break;

    case "monorepo":
      const subDirs = getSubdirectories(".");
      const hasSrcOrLibAtRoot = subDirs.includes("src") || subDirs.includes("lib");

      const repos = hasSrcOrLibAtRoot
        ? [
            { path: ".", name: getPackageJson(process.cwd()).name || "unnamed" },
            ...(await getMonoRepoPackages(".", opts.exclude)),
          ]
        : await getMonoRepoPackages(".", opts.exclude);

      for (const r of repos) {
        const { indexGlobs, indexFiles, nonAutoindexFiles } = await getIndex(r.path, opts);
        const { contentGlobs, contentFiles } = await getContent(r.path, opts);

        const group: AutoindexGroupDefinition = {
          kind: "monorepo",
          ...r,
          indexFiles,
          indexGlobs,
          contentFiles,
          contentGlobs,
          nonAutoindexFiles,
        };

        groups.push(group);
      }

      if (groups.length > 0) {
        log.info(
          chalk`- ${emoji.eyeballs} monorepo detected with {yellow ${String(
            groups.length
          )}} packages`
        );
        for (const pkg of groups) {
          log.info(chalk`{gray   - {bold ${pkg.name}} {italic at} {dim ${pkg.path}}}`);
        }
        log.info(chalk`- ⚡️ will run each package separately based on it's own configuration`);
      } else {
        log.info(
          chalk`- after excluding packages -- {gray ${opts.exclude?.join(
            ", "
          )}} -- no packages were left to run {bold autoindex} on\n`
        );
        exit(0);
      }
  }

  const watchlist: AutoindexGroupDefinition[] = [];

  for (const group of groups) {
    if (groups.length > 1) {
      log.info(chalk`\n- ${emoji.run} starting analysis of {blue ${group.name}}`);
    }

    if (group.indexFiles.length > 0) {
      await processFiles(group, opts, observations);
    } else {
      log.info(chalk`- ${emoji.confused} no {italic index} files found in {blue ${group.name}}`);
    }

    if (opts.watch) {
      watchlist.push(group);
      watch(group, opts);
    }
  }
};

import * as chalk from "chalk";
import * as globby from "globby";

import { basename, dirname, join } from "path";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { getMonoRepoPackages, relativePath } from "../shared/file";

import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
import { askHowToHandleMonoRepoIndexing } from "./autoindex/index";
import { exportsAsEsm } from "../shared";
import { format } from "date-fns";

const START_REGION = "//#region autoindexed files";
const END_REGION = "//#endregion";

export function description() {
  return `Automates the building of "index.ts" (and now "private.ts") files for exporting; if you include a comment starting with "// #autoindex into a file it will be auto-indexed. By default it will assume that you are using named exports but if you need default exports then you must state "// #autoindex:default" Finally, if you need to exclude certain files you can explicitly state them after the autoindex declaration with "exclude:a,b,c`;
}

export const options: OptionDefinition[] = [
  {
    name: "add",
    type: String,
    group: "autoindex",
    description: `adds additional glob patterns to look for`,
  },
  {
    name: "glob",
    type: String,
    group: "autoindex",
    description: `replaces the glob file matching pattern with your own (however "node_modules" still excluded)`,
  },
  {
    name: "dir",
    type: String,
    group: "autoindex",
    description: `by default will look for files in the "src" directory but you can redirect this to a different directory`,
  },
];

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

function timestamp() {
  return `// indexed at: ${format(Date.now(), "Mo MMM, yyyy, hh:mm a ( O )")}\n`;
}

/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
async function processFiles(paths: string[], opts: IDictionary) {
  const results: IDictionary<string> = {};

  for await (const path of paths) {
    const fileString = readFileSync(path, { encoding: "utf-8" });
    if (fileString.includes("// #autoindex") || fileString.includes("//#autoindex")) {
      results[path] = fileString;
    }
  }
  if (Object.keys(results).length === 0) {
    if (opts.withinMonorepo) {
      console.log(chalk`- No {italic autoindex} files found`);
      return;
    } else {
      communicateApi(paths);
    }
  } else {
    // iterate over each autoindex file
    for (const filePath of Object.keys(results)) {
      let fileContent = results[filePath];
      const excluded = exclusions(fileContent);
      // console.log({ excluded });

      const exportableFiles = await exportable(filePath, excluded);
      const autoIndexContent: string = fileContent.includes(":default")
        ? defaultExports(exportableFiles)
        : namedExports(exportableFiles);

      if (alreadyHasIndex(fileContent)) {
        fileContent = replaceRegion(fileContent, autoIndexContent);
        const warnings = unexpectedContent(fileContent);
        console.log(
          chalk`- updated index {blue ./${relativePath(filePath)}}${
            warnings ? chalk` {red has unexpected content: {italic {dim ${Object.keys(warnings).join(", ")} }}}` : ""
          }`
        );
      } else {
        fileContent = `${fileContent}\n${START_REGION}\n${timestamp()}${autoIndexContent}\n${END_REGION}`;
        console.log(chalk`- added index to {blue ./${relativePath(filePath)}}`);
      }
      writeFileSync(filePath, fileContent);
    }
  }
  console.log();
}

function exclusions(file: string): string[] {
  return file.includes("exclude:") ? file.replace(/.*exclude:([\w,]*)/, "$1").split(",") : [];
}

interface IExportableFiles {
  /** files which being exported */
  files: string[];
  /** directories which have an index.ts in them */
  dirs: string[];
  /** base directory which search was done in */
  base: string;
}

/**
 * determines the files and directories in a _given directory_ that should be included in the index file
 */
async function exportable(filePath: string, excluded: string[]): Promise<IExportableFiles> {
  const dir = dirname(filePath);
  const thisFile = basename(filePath);
  const exclusions = excluded.concat(thisFile).concat(["index.js", "index.ts"]);
  const files = (await globby([`${dir}/*.ts`, `${dir}/*.js`]))
    .filter((file) => !exclusions.includes(basename(file)))
    .map((i) => basename(i));
  const dirs: string[] = [];
  readdirSync(dir, { withFileTypes: true })
    .filter((i) => i.isDirectory())
    .map((i) => {
      if (existsSync(join(dir, i.name, "index.ts"))) {
        dirs.push(i.name);
      } else if (existsSync(join(dir, i.name, "index.js"))) {
        dirs.push(i.name);
      }
    });
  return { files, base: dir, dirs };
}

/** indicates whether the given file already has a index region defined */
function alreadyHasIndex(fileContent: string) {
  return fileContent.includes(START_REGION) && fileContent.includes(END_REGION);
}

/** replace an existing region block with a new one */
function replaceRegion(fileContent: string, regionContent: string) {
  const re = new RegExp(`${START_REGION}.*${END_REGION}\n`, "gs");
  const replacementContent = `${START_REGION}\n${timestamp()}${regionContent}\n${END_REGION}\n`;
  return fileContent.replace(re, replacementContent);
}

function exportsHaveChanged(fileContent: string, regionContent: string) {
  const start = new RegExp(`${START_REGION}\n`, "gs");
  const end = new RegExp(`${END_REGION}\n`, "gs");
  const before = fileContent
    .replace(start, "")
    .replace(end, "")
    .split("\n")
    .filter((i) => i);
  // const after =
}

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
function namedExports(exportable: IExportableFiles) {
  const contentLines: string[] = [];
  exportable.files.forEach((file) => {
    contentLines.push(`export * from "./${exportsAsEsm() ? removeExtension(file) + ".js" : removeExtension(file)}";`);
  });
  exportable.dirs.forEach((dir) => {
    contentLines.push(`export * from "./${dir}/index${exportsAsEsm() ? ".js" : ""}";`);
  });

  return contentLines.join("\n");
}

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
function defaultExports(exportable: IExportableFiles) {
  const contentLines: string[] = [];
  exportable.files.forEach((file) => {
    contentLines.push(`export { default as ${removeExtension(file, true)} } from "./${removeExtension(file)}";`);
  });
  exportable.dirs.forEach((dir) => {
    contentLines.push(`export * from "${dir}/index";`);
  });

  return contentLines.join("\n");
}

/**
 * Looks for content that typically should not be in a index file so
 * it can be communicated to the user
 */
function unexpectedContent(fileContent: string) {
  const warnings: IDictionary<boolean> = {};
  if (fileContent.includes("export type") || fileContent.includes("export interface")) {
    warnings["inline interfaces"] = true;
  }
  if (fileContent.includes("import ")) {
    warnings.imports = true;
  }
  if (fileContent.includes("enum ")) {
    warnings.enums = true;
  }
  if (fileContent.includes("function ")) {
    warnings.functions = true;
  }

  return Object.keys(warnings).length > 0 ? warnings : false;
}

function removeExtension(file: string, force: boolean = false) {
  const parts = file.split(".");
  const [fn, ext] =
    parts.length > 2 ? [file.replace("." + parts[parts.length - 1], ""), parts[parts.length - 1]] : file.split(".");

  return ext === "vue" && !force ? file : fn;
}

function communicateApi(paths: string[]) {
  console.log(
    `- Scanned through ${chalk.bold(String(paths.length))} ${chalk.italic(
      "index"
    )} files but none of them were "autoindex" files.\n`
  );
  console.log(
    `${chalk.bold("  Note: ")}${chalk.dim.italic('to make an "index.ts" or "index.js" file an "autoindex file"')}`
  );
  console.log(chalk.dim.italic("  you must add in the following to your index file (ideally on the first line):\n"));

  console.log("  " + chalk.whiteBright.bgBlue("//#autoindex:[CMD] \n"));
  console.log(
    chalk.dim.italic("  where the valid commands are (aka, CMD from above): ") + chalk.italic("named,defaults")
  );
  console.log(
    chalk`  {white {bold Note:}}\n    {dim {italic you can also add the "--add" flag to look for other regex files patterns}}`
  );
}

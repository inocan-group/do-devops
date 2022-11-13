/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/number-literal-case */
import chalk from "chalk";
import { detectExportType, exclusions, createAutoindexContent } from "./index";
import { IAutoindexFile } from "./reference";
import {
  getEmbeddedHashCode,
  hasOldHelpContent,
  isNewAutoindexFile,
  isOrphanedIndexFile,
  replaceRegion,
} from "./util";
import { emoji, highlightFilepath } from "src/shared/ui";
import { logger } from "src/shared/core";
import { Options, Observations } from "src/@types";
import { dirname, join } from "pathe";
import { IAutoindexOptions } from "../parts";
import { writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { fileHasExports } from "src/shared/ast";
import xxhash from "xxhash-wasm";
import { getFileComponents } from "src/shared/file/utility/getFileComponents";
import { getSubdirectories } from "src/shared/file/utility/getSubdirectories";
import { AutoindexGroupDefinition } from "../parts/getGlobs";
import { cwd } from "node:process";
import { directoryFiles, repoDirectory } from "src/shared/file";
import { relative } from "node:path";
import { hasDependency, hasDevDependency } from "src/shared/npm";
import { spawnSync } from "node:child_process";

/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
export async function processFiles(
  group: AutoindexGroupDefinition,
  opts: Options<IAutoindexOptions>,
  _o: Observations
) {
  const log = logger(opts);
  // eslint-disable-next-line prefer-const
  let { contentFiles, indexFiles, nonAutoindexFiles } = group;
  const { h32 } = await xxhash();

  if (indexFiles.length === 0) {
    log.info(chalk`- ${emoji.confused} no {italic autoindex} files found in this package`);
    return;
  } else {
    log.info(
      chalk`- {yellow ${indexFiles.length}} autoindex files found ({dim out of {yellow ${
        indexFiles.length + nonAutoindexFiles.length
      }} candidates})`
    );
    log.whisper(chalk`- index files were: {gray ${indexFiles.join(", ")}}`);
  }

  // Iterate by Index File
  for (const indexFilename of indexFiles) {
    let action: "new-file" | "unchanged" | "updated";
    /** Directory that given autoindex file is responsible for */
    const dir = dirname(indexFilename);
    /** the file content of the autoindex file */
    const indexFileContent = readFileSync(indexFilename, "utf8");
    /** any _explicit_ excludes above and beyond the blacklist rules */
    const explicitExcludes = exclusions(indexFileContent);
    /** the type of _export_ to be in the autoindex file (aka, named, default, etc.) */
    const exportType = detectExportType(indexFileContent);

    const subDirs = getSubdirectories(join(cwd(), dir));

    /**
     * All the files found at the same level as the autoindex file we're processing
     */
    const filesAtSameLevel = directoryFiles(join(cwd(), dir))
      .map((f) => f.file)
      .map((i) => join(dir, i));

    contentFiles = filesAtSameLevel.filter(
      (f) =>
        (f.endsWith(".js") || f.endsWith(".ts") || (f.endsWith(".vue") && opts.sfc)) &&
        !f.endsWith("index.js") &&
        !f.endsWith("index.ts")
    );
    const noExports = contentFiles.filter((f) => !fileHasExports(f));
    const remaining = contentFiles.length - noExports.length;

    log.whisper(
      chalk`- processing the {bold {italic autoindex}} file in {blue ${dir}} [{dim ${exportType} {italic export}, ${remaining} of ${contentFiles.length} {italic files}, ${subDirs.length} {italic sub directories}}]`
    );

    if (contentFiles.length === 0) {
      log.whisper(chalk`- there are no files in ${dir} which were found to export symbols!`);
      return;
    }

    log.whisper(
      chalk`- content files are:\n\t{gray ${contentFiles
        .map(
          (f) => `${highlightFilepath(relative(cwd(), f))} [${noExports.includes(f) ? "x" : "✓"}]`
        )
        .join("\n\t")}}`
    );

    if (noExports.length > 0) {
      for (const f of noExports) {
        log.whisper(chalk`- the file {red ${f}} will be ignored because it has no exports`);
      }
      if (contentFiles.length === noExports.length) {
        log.info(
          chalk`- the directory {blue ${dir}} had  {yellow ${contentFiles.length}} files which {italic could} have exported symbols but {bold none did}.`
        );
      } else {
        log.info(
          chalk`- the directory {blue ${dir}} had {yellow ${contentFiles.length}} files which {italic could} have had export symbols but {yellow ${noExports.length}} {bold did not}.`
        );
      }
    }

    // remove files which have no export
    contentFiles =
      noExports.length > 0 ? contentFiles.filter((i) => noExports.includes(i)) : contentFiles;

    const orphans: string[] = [];
    const noIndexFile: string[] = [];
    const explicitDirRemoval: string[] = [];
    const noExportDir: string[] = [];

    // iterate over sub directories
    const dirs = getSubdirectories(dir).reduce((acc, d) => {
      const ts = join(dir, d, "/index.ts");
      const js = join(dir, d, "/index.js");
      const child = ts || js;
      if (!existsSync(child)) {
        log.whisper(
          chalk`{gray - will not include the {blue ${d}} directory because there is {italic {red no index file}}}`
        );
        noIndexFile.push(d);
        return acc;
      } else if (isOrphanedIndexFile(child)) {
        log.whisper(
          chalk`{gray - will not include the directory {blue ${d}} because it is configured as an {italic {red orphan}}}`
        );
        orphans.push(d);
        return acc;
      } else if (!explicitExcludes.every((e) => d !== e)) {
        log.whisper(
          chalk`{gray - will not include the directory {blue ${d}} because it is configured as an {italic {red orphan}}}`
        );
        explicitDirRemoval.push(d);
        return acc;
      } else if (!fileHasExports(child)) {
        log.whisper(
          chalk`{gray - will not include the directory {blue ${d}} because it has {italic {red no exports}}}`
        );
        noExportDir.push(d);
        return acc;
      }

      return [...acc, d];
    }, [] as string[]);
    const fileSymbols = contentFiles.map((f) => getFileComponents(f).filename);

    const priorHash = isNewAutoindexFile(indexFileContent)
      ? undefined
      : getEmbeddedHashCode(indexFileContent);
    const hashCode = h32(
      JSON.stringify({
        fileSymbols,
        dirs,
        explicitExcludes,
        orphans,
        noIndexFile,
        exportType,
        explicitDirRemoval,
        noExportDir,
        sfc: opts.sfc || false,
      }),
      0xcafebabe
    );

    const content: IAutoindexFile = {
      exportType,
      files: fileSymbols,
      dirs,
      hashCode,
    };

    const hasChanged =
      priorHash !== hashCode || opts.force === true || hasOldHelpContent(indexFileContent);

    // if change to hash code or has the old help content then re-write index file
    if (hasChanged) {
      action = isNewAutoindexFile(indexFileContent) ? "new-file" : "updated";
      const result = createAutoindexContent(content, opts);
      // const prettierConfig = await prettier.resolveConfig(join(cwd(), indexFilename));

      const fileContent = action === "new-file" ? result : replaceRegion(indexFileContent, result);

      writeFile(indexFilename, fileContent, "utf8");
      if (hasDependency("eslint") || hasDevDependency("eslint")) {
        spawnSync("eslint", [indexFilename, "--fix"], {
          cwd: repoDirectory(),
        });
      }
    } else {
      action = "unchanged";
    }

    switch (action) {
      case "new-file":
        log.info(
          chalk`- autoindex file ${highlightFilepath(indexFilename)} is a {italic {bold new}} file`
        );
        break;
      case "updated":
        log.info(
          chalk`- autoindex file ${highlightFilepath(indexFilename)} was {italic {bold updated}}.`
        );
        break;
      case "unchanged":
        const talk = opts.explicitFiles ? log.info : log.whisper;
        talk(
          chalk`{dim - autoindex file ${highlightFilepath(
            indexFilename
          )} was left {italic {bold unchanged}}}.`
        );
        break;
    }
  }
}

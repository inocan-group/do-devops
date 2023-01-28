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
import { directoryFiles } from "src/shared/file";
import { relative } from "node:path";

/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
export async function processFiles(
  group: AutoindexGroupDefinition,
  options: Options<IAutoindexOptions>,
  _o: Observations
) {
  const log = logger(options);
  // eslint-disable-next-line prefer-const
  let { contentFiles, indexFiles, nonAutoindexFiles } = group;
  const { h32 } = await xxhash();
  const totalCount = indexFiles.length + nonAutoindexFiles.length;

  if (indexFiles.length === 0) {
    log.info(`- ${emoji.confused} no ${chalk.italic`autoindex`} files found in this package`);
    return;
  } else {
    log.info(
      `- ${chalk.yellow.bold(indexFiles.length)} autoindex files found (${chalk.dim`out of ${chalk.yellow(String(totalCount))}`} candidates)`
    );
    log.whisper(`- index files were: ${chalk.gray`${indexFiles.join(", ")}}`}`);
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
        (f.endsWith(".js") || f.endsWith(".ts") || (f.endsWith(".vue") && options.sfc)) &&
        !f.endsWith("index.js") &&
        !f.endsWith("index.ts")
    );
    const noExports = contentFiles.filter((f) => !fileHasExports(f));
    const remaining = contentFiles.length - noExports.length;

    log.whisper(
      `- processing the ${chalk.bold.italic`autoindex`} file in ${chalk.blue(dir)} [${chalk.dim(exportType)} ${chalk.italic`export`}, ${remaining} of ${contentFiles.length} ${chalk.italic`files`}, ${subDirs.length} ${chalk.italic`sub directories`}]`
    );

    if (contentFiles.length === 0) {
      log.whisper(`- there are no files in ${dir} which were found to export symbols!`);
      return;
    }

    log.whisper(
      `- content files are:\n\t${chalk.gray(contentFiles
        .map(
          (f) => `${highlightFilepath(relative(cwd(), f))} [${noExports.includes(f) ? "x" : "✓"}]`
        )
        .join("\n\t"))}`
    );

    if (noExports.length > 0) {
      for (const f of noExports) {
        log.whisper(`- the file ${chalk.red(f)} will be ignored because it has no exports`);
      }
      if (contentFiles.length === noExports.length) {
        log.info(
          `- the directory ${chalk.blue(dir)} had  ${chalk.yellow(contentFiles.length)} files which ${chalk.italic`could`} have exported symbols but ${chalk.bold`none did`}.`
        );
      } else {
        log.info(
          `- the directory ${chalk.blue(dir)} had ${chalk.yellow(contentFiles.length)} files which ${chalk.italic(`could`)} have had export symbols but ${chalk.yellow(noExports.length)} ${chalk.bold`did not`}.`
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
          chalk.gray(` - will not include the ${chalk.blue(d)}} directory because there is ${chalk.italic.red`no index file`}`
        ));
        noIndexFile.push(d);
        return acc;
      } else if (isOrphanedIndexFile(child)) {
        log.whisper(
          chalk.gray(` - will not include the directory ${chalk.blue(d)}} because it is configured as an ${chalk.italic.red`orphan`}`
        ));
        orphans.push(d);
        return acc;
      } else if (!explicitExcludes.every((e) => d !== e)) {
        log.whisper(
          chalk.gray(` - will not include the directory ${chalk.blue(d)}} because it is configured as an ${chalk.italic.red`orphan`}`
        ));
        explicitDirRemoval.push(d);
        return acc;
      } else if (!fileHasExports(child)) {
        log.whisper(
          chalk.gray` - will not include the directory ${chalk.blue(d)}} because it has ${chalk.italic.red`no exports`}`
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
    const hashCode = String(h32(
      JSON.stringify({
        fileSymbols,
        dirs,
        explicitExcludes,
        orphans,
        noIndexFile,
        exportType,
        explicitDirRemoval,
        noExportDir,
        sfc: options.sfc || false,
      }),
      0xcafebabe
    ));

    const content: IAutoindexFile = {
      exportType,
      files: fileSymbols,
      dirs,
      hashCode,
    };

    const hasChanged =
      priorHash !== hashCode || options.force === true || hasOldHelpContent(indexFileContent);

    // if change to hash code or has the old help content then re-write index file
    if (hasChanged) {
      action = isNewAutoindexFile(indexFileContent) ? "new-file" : "updated";
      const result = createAutoindexContent(content, options);
      const fileContent = action === "new-file" ? result : replaceRegion(indexFileContent, result);
      // WRITE INDEX FILE
      if (options.dryRun) {
        log.dryRun(`index file "${indexFilename}" would be written because: ${action}`);
      } else {
        writeFile(indexFilename, fileContent, "utf8");
      }
    } else {
      action = "unchanged";
      if(options.dryRun) {
        log.dryRun(chalk.dim(`index file "${chalk.bold(indexFilename)}" will not be changed as it has not changed`));
      }
    }

    if(!options.dryRun) {
      switch (action) {
        case "new-file": {
          log.info(
            `- autoindex file ${highlightFilepath(indexFilename)} is a ${chalk.bold.italic("new")}} file")`
          );
          break;
        }
        case "updated": {
          log.info(
            `- autoindex file ${highlightFilepath(indexFilename)} was ${chalk.bold.italic("updated")}.`
          );
          break;
        }
        case "unchanged": {
          const talk = options.explicitFiles 
            ? log.info 
            : log.whisper;
  
          talk(
            `${chalk.dim(` - autoindex file ${highlightFilepath(
              indexFilename
            )} was left ${chalk.italic.bold(" unchanged")}.`)}`
          );
          break;
        }
      }
    }
  }
}

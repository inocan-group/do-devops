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
import { getFileComponents, getSubdirectories } from "src/shared/file";
import { IAutoindexOptions } from "../parts";
import { appendFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { fileHasExports } from "src/shared/ast";
import xxhash from "xxhash-wasm";

export interface WhiteBlackList {
  whitelist: string[];
  blacklist: string[];
}

/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
export async function processFiles(
  autoindexFiles: string[],
  opts: Options<IAutoindexOptions>,
  _o: Observations,
  scope: WhiteBlackList
) {
  const log = logger(opts);
  const { h32 } = await xxhash();
  if (autoindexFiles.length === 0) {
    log.info(chalk`- ${emoji.confused} no {italic autoindex} files found in this package`);
    return;
  }

  for (const indexFilename of autoindexFiles) {
    let action: "new-file" | "unchanged" | "updated";
    /** Directory that given autoindex file is responsible for */
    const dir = dirname(indexFilename);
    /** the file content of the autoindex file */
    const fileContent = readFileSync(indexFilename, "utf8");
    /** any _explicit_ excludes above and beyond the blacklist rules */
    const explicitExcludes = exclusions(fileContent);
    /** the type of _export_ to be in the autoindex file (aka, named, default, etc.) */
    const exportType = detectExportType(fileContent);
    /** only those in the immediate directory */
    const whitelist = scope.whitelist.filter((f) => dirname(f) === dir);

    /**
     * The record of black listed items grouped by "reason"
     */
    const blackBook: Record<string, { blacklist: []; explicit: []; dirs: [] }> = {};

    const files = whitelist
      // only those in current dir
      .filter((f) => dirname(f) === dir)
      // based on blacklist or local exclusions
      .filter((f) => {
        if (scope.blacklist.includes(f)) {
          typeof blackBook[f] === "object"
            ? { blacklist: [...blackBook[f].blacklist, f], explicit: blackBook[f].explicit }
            : { blacklist: [f], explicit: [] };

          return false;
        } else if (
          explicitExcludes.length > 0 &&
          !explicitExcludes.every((ex) => !f.includes(ex))
        ) {
          typeof blackBook[f] === "object"
            ? { blacklist: blackBook[f].blacklist, explicit: [...blackBook[f].explicit, f] }
            : { blacklist: [], explicit: [f] };

          return false;
        }
        return true;
      });

    // verbose messaging on exclusions
    for (const key of Object.keys(blackBook)) {
      if (blackBook[key].explicit.length > 0) {
        log.whisper(
          chalk`{gray - autoindex file {blue ${highlightFilepath(
            key
          )}} will {italic exclude} the following based on {bold explicit exclusions} in the autoindex file: ${blackBook[
            key
          ].explicit
            .map((ex) => getFileComponents(ex, process.cwd()))
            .join("\t")}}`
        );
      }

      if (blackBook[key].blacklist.length > 0) {
        log.whisper(
          chalk`{gray - autoindex file {blue ${highlightFilepath(
            key
          )}} will {italic exclude} the following based on the {bold blacklist}: ${blackBook[
            key
          ].explicit
            .map((ex) => getFileComponents(ex, process.cwd()))
            .join("\t")}}`
        );
      }
    }

    const orphans: string[] = [];
    const noIndexFile: string[] = [];
    const explicitDirRemoval: string[] = [];
    const noExportDir: string[] = [];

    const dirs = getSubdirectories(dir).reduce((acc, d) => {
      const ts = join(dir, d, "/index.ts");
      const js = join(dir, d, "/index.js");
      const child = ts || js;
      if (!existsSync(child)) {
        log.whisper(
          chalk`{gray - autoindex file ${highlightFilepath(
            indexFilename
          )} will not include the {blue ${d}} directory because there is {italic {red no index file}}}`
        );
        noIndexFile.push(d);
        return acc;
      } else if (isOrphanedIndexFile(child)) {
        log.whisper(
          chalk`{gray - autoindex file ${highlightFilepath(
            indexFilename
          )} will not include the directory {blue ${d}} because it is configured as an {italic {red orphan}}}`
        );
        orphans.push(d);
        return acc;
      } else if (!explicitExcludes.every((e) => d !== e)) {
        log.whisper(
          chalk`{gray - autoindex file ${highlightFilepath(
            indexFilename
          )} will not include the directory {blue ${d}} because it is configured as an {italic {red orphan}}}`
        );
        explicitDirRemoval.push(d);
        return acc;
      } else if (!fileHasExports(child)) {
        log.info(
          chalk`{gray - autoindex file ${highlightFilepath(
            indexFilename
          )} will not include the directory {blue ${d}} because it has {italic {red no exports}}}`
        );
        noExportDir.push(d);
        return acc;
      }

      return [...acc, d];
    }, [] as string[]);
    const fileSymbols = files.map((f) => getFileComponents(f).filename);

    const priorHash = isNewAutoindexFile(fileContent)
      ? undefined
      : getEmbeddedHashCode(fileContent);
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

    // if change to hash code or has the old help content then re-write index file
    if (priorHash !== hashCode || opts.force === true || hasOldHelpContent(fileContent)) {
      action = isNewAutoindexFile(fileContent) ? "new-file" : "updated";
      const result = createAutoindexContent(content, opts);

      await (action === "new-file"
        ? appendFile(indexFilename, result)
        : writeFile(indexFilename, replaceRegion(fileContent, result), "utf8"));
    } else {
      action = "unchanged";
    }

    switch (action) {
      case "new-file":
        log.info(
          chalk`- autoindex file ${highlightFilepath(
            indexFilename
          )} is a {italic {bold new}} autoindex file`
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

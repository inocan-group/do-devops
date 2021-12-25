/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/number-literal-case */
import chalk from "chalk";
import { detectExportType, exclusions, createAutoindexContent } from "./index";
import xxHash from "xxhash";
import { IAutoindexFile } from "./reference";
import {
  getEmbeddedHashCode,
  isNewAutoindexFile,
  isOrphanedIndexFile,
  replaceRegion,
} from "./util";
import { emoji, highlightFilepath } from "~/shared/ui";
import { logger } from "~/shared/core";
import { Options, Observations } from "~/@types";
import path from "path";
import { getFileComponents, getSubdirectories } from "~/shared/file";
import { IAutoindexOptions } from "../parts";
import { appendFile, writeFile } from "fs/promises";
import { existsSync, readFileSync } from "fs";

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
  if (autoindexFiles.length === 0) {
    log.info(chalk`- ${emoji.confused} no {italic autoindex} files found in this package`);
    return;
  }

  for (const ai of autoindexFiles) {
    let action: "new-file" | "unchanged" | "updated";
    /** Directory that given autoindex file is reponsible for */
    const dir = path.posix.dirname(ai);
    /** the file content of the autoindex file */
    const aiContent = readFileSync(ai, "utf-8");

    /** any _explicit_ excludes above and beyond the blacklist rules */
    const explicitExcludes = exclusions(aiContent);
    /** the type of _export_ to be in the autoindex file (aka, named, default, etc.) */
    const exportType = detectExportType(aiContent);

    /** only those in the immediate directory */
    const whitelist = scope.whitelist.filter((f) => path.posix.dirname(f) === dir);

    /**
     * The record of black listed items grouped by "reason"
     */
    const blackBook: Record<string, { blacklist: []; explicit: []; dirs: [] }> = {};

    const files = whitelist
      // only those in current dir
      .filter((f) => path.posix.dirname(f) === dir)
      // based on blacklist or local exclusions
      .filter((f) => {
        if (scope.blacklist.includes(f)) {
          typeof blackBook[f] === "object"
            ? { blacklist: [...blackBook[f].blacklist, f], explict: blackBook[f].explicit }
            : { blacklist: [f], explict: [] };

          return false;
        } else if (
          explicitExcludes.length > 0 &&
          !explicitExcludes.every((ex) => !f.includes(ex))
        ) {
          typeof blackBook[f] === "object"
            ? { blacklist: blackBook[f].blacklist, explict: [...blackBook[f].explicit, f] }
            : { blacklist: [], explict: [f] };

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

    const dirs = getSubdirectories(dir).reduce((acc, d) => {
      const child = path.posix.join(dir, d, "/index.ts");
      if (!existsSync(child)) {
        log.whisper(
          chalk`{gray - autoindex file ${highlightFilepath(
            ai
          )} will not include the {blue ${d}} directory because there is {italic {red no index file}}}`
        );
        noIndexFile.push(d);
        return acc;
      } else if (isOrphanedIndexFile(child)) {
        log.whisper(
          chalk`{gray - autoindex file ${highlightFilepath(
            ai
          )} will not include the directory {blue ${d}} because it is configured as an {italic {red orphan}}}`
        );
        orphans.push(d);
        return acc;
      } else if (!explicitExcludes.every((e) => d !== e)) {
        log.whisper(
          chalk`{gray - autoindex file ${highlightFilepath(
            ai
          )} will not include the directory {blue ${d}} because it is configured as an {italic {red orphan}}}`
        );
        explicitDirRemoval.push(d);
        return acc;
      }

      return [...acc, d];
    }, [] as string[]);
    const fileSymbols = files.map((f) => getFileComponents(f).filename);

    const priorHash = isNewAutoindexFile(aiContent) ? undefined : getEmbeddedHashCode(aiContent);
    const hashCode = xxHash.hash(
      Buffer.from(
        JSON.stringify({
          fileSymbols,
          dirs,
          explicitExcludes,
          orphans,
          noIndexFile,
          explicitDirRemoval,
          sfc: opts.sfc || false,
        })
      ),
      0xcafebabe
    );

    const content: IAutoindexFile = {
      exportType,
      files: fileSymbols,
      dirs,
      hashCode,
    };

    // if change to hash code the re-write index file
    if (priorHash !== hashCode) {
      action = isNewAutoindexFile(aiContent) ? "new-file" : "updated";
      const result = createAutoindexContent(content, opts);

      await (action === "new-file"
        ? appendFile(ai, result)
        : writeFile(ai, replaceRegion(aiContent, result), "utf-8"));
    } else {
      action = "unchanged";
    }

    switch (action) {
      case "new-file":
        log.info(
          chalk`- autoindex file ${highlightFilepath(ai)} is a {italic {bold new}} autoindex file`
        );
        break;
      case "updated":
        log.info(chalk`- autoindex file ${highlightFilepath(ai)} was {italic {bold updated}}.`);
        break;
      case "unchanged":
        log.whisper(
          chalk`{dim - autoindex file ${highlightFilepath(ai)} was left {italic {bold unchanged}}}.`
        );
        break;
    }
  }
}

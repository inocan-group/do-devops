import chalk from "chalk";

import {
  END_REGION,
  ExportAction,
  START_REGION,
  alreadyHasAutoindexBlock,
  defaultExports,
  detectExportType,
  exclusions,
  exportable,
  namedExports,
  replaceRegion,
  timestamp,
  unexpectedContent,
  namedOffsetExports,
  createMetaInfo,
  getExistingMetaInfo,
  nonBlockContent,
  noDifference,
} from "./index";
import { readFileSync, writeFileSync } from "fs";

import { AUTOINDEX_INFO_MSG, ExportType } from "./reference";
import { IDictionary } from "common-types";

import { removeAllExtensions, cleanOldBlockFormat } from "./util";
import { highlightFilepath } from "~/shared/ui";
import { DevopsError } from "~/errors";
import { logger } from "~/shared/core";
import { Observations } from "~/@types";
import path from "path";

export interface WhiteBlackList {
  whitelist?: string[];
  blacklist: string[];
}

/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
export async function processFiles(
  paths: string[],
  opts: IDictionary,
  _o: Observations,
  scope: WhiteBlackList
) {
  const log = logger(opts);
  const results: IDictionary<string> = {};
  const defaultExclusions = ["index", "private"];
  const baseExclusions = opts.add
    ? [...defaultExclusions, ...(opts.add as string).split(",").map((i) => i.trim())]
    : defaultExclusions;

  for await (const path of paths) {
    const fileString = readFileSync(path, { encoding: "utf-8" });
    const isAutoIndex = /^\/\/\s*#autoindex/;
    if (isAutoIndex.test(fileString)) {
      results[path] = fileString;
    }
  }
  if (Object.keys(results).length === 0) {
    log.info(chalk`- No {italic autoindex} files found in this package`);
  } else {
    // iterate over each autoindex file
    for (const filePath of Object.keys(results)) {
      const fileContent = results[filePath];
      const dir = path.posix.dirname(filePath);
      const blacklist = scope.blacklist
        .filter((i) => i.includes(dir))
        .flatMap((i) =>
          i
            .replace(path.posix.dirname(i) + "/", "")
            .split(".")
            .slice(0, -1)
        );
      if (blacklist.length > 0) {
        log.whisper(
          chalk`{gray - index file {blue ${highlightFilepath(
            filePath
          )}} will exclude the following based on {italic blacklist} rules:}`
        );
        for (const item of blacklist) {
          log.whisper(chalk`{dim   - ${item}}`);
        }
      }
      const explicit = exclusions(fileContent);
      if (explicit.some((i) => !["index", "private"].includes(i))) {
        log.whisper(
          chalk`{gray - index file {blue ${highlightFilepath(
            filePath
          )}} will exclude the following based on {italic explicit exclusions} in the file:}`
        );
        for (const item of explicit) {
          log.whisper(chalk`{dim   - ${item}}`);
        }
      }
      const excluded = [...new Set([...explicit, ...baseExclusions, ...blacklist])];
      const exportableSymbols = await exportable(filePath, excluded);
      const exportType = detectExportType(fileContent);

      let autoIndexContent: string;

      switch (exportType) {
        case ExportType.default:
          autoIndexContent = defaultExports(exportableSymbols, opts);
          break;
        case ExportType.namedOffset:
          autoIndexContent = namedOffsetExports(exportableSymbols, opts);
          break;
        case ExportType.named:
          autoIndexContent = namedExports(exportableSymbols, opts);
          break;
        default:
          throw new DevopsError(`Unknown export type: ${exportType}!`, "invalid-export-type");
      }
      /** content that defines the full region owned by autoindex */
      const blockContent = `${START_REGION}\n\n${timestamp()}\n${createMetaInfo(
        exportType,
        exportableSymbols,
        excluded,
        opts
      )}\n${autoIndexContent}\n\n${AUTOINDEX_INFO_MSG}\n\n${END_REGION}`;

      const existingContentMeta = getExistingMetaInfo(fileContent);

      let exportAction: ExportAction | undefined;
      const bracketedMessages: string[] = [];
      if (exportType !== ExportType.named) {
        bracketedMessages.push(chalk`{grey using }{italic ${exportType}} {grey export}`);
      }

      const hasOldStyleBlock = /\/\/#region.*\/\/#endregion/s.test(fileContent);

      if (autoIndexContent && alreadyHasAutoindexBlock(fileContent)) {
        if (
          noDifference(existingContentMeta.files, removeAllExtensions(exportableSymbols.files)) &&
          noDifference(existingContentMeta.dirs, removeAllExtensions(exportableSymbols.dirs)) &&
          noDifference(existingContentMeta.sfcs, removeAllExtensions(exportableSymbols.sfcs)) &&
          exportType === existingContentMeta.exportType &&
          noDifference(existingContentMeta.exclusions, excluded)
        ) {
          exportAction = hasOldStyleBlock ? ExportAction.refactor : ExportAction.noChange;
        } else {
          exportAction = ExportAction.updated;
        }
      } else if (autoIndexContent) {
        exportAction = ExportAction.added;
      }

      // BUILD UP CLI MESSAGE
      const warnings = unexpectedContent(nonBlockContent(fileContent));
      if (warnings) {
        bracketedMessages.push(
          chalk` {red unexpected content: {italic {dim ${Object.keys(warnings).join(", ")} }}}`
        );
      }

      const excludedWithoutBase = excluded.filter((i) => !baseExclusions.includes(i));
      if (excludedWithoutBase.length > 0) {
        bracketedMessages.push(chalk`{italic excluding:} {grey ${excludedWithoutBase.join(", ")}}`);
      }

      const bracketedMessage =
        bracketedMessages.length > 0 ? chalk`{dim [ ${bracketedMessages.join(", ")} ]}` : "";

      const changeMessage = chalk`- ${
        exportAction === ExportAction.added ? "added" : "updated"
      } ${highlightFilepath(filePath)} ${bracketedMessage}`;

      const refactorMessage = chalk`- removing an old form of autoindex block style at ${highlightFilepath(
        filePath
      )}`;

      const unchangedMessage = chalk`{dim - {italic no changes} to ${highlightFilepath(
        filePath
      )}} ${bracketedMessage}`;

      if (!opts.quiet && exportAction === ExportAction.noChange) {
        log.whisper(unchangedMessage);
      } else if (exportAction === ExportAction.refactor) {
        log.info(refactorMessage);
        writeFileSync(
          filePath,
          cleanOldBlockFormat(
            existingContentMeta.hasExistingMeta
              ? replaceRegion(fileContent, blockContent)
              : `${fileContent}\n${blockContent}\n`
          )
        );
      } else {
        console.log(changeMessage);
        writeFileSync(
          filePath,
          cleanOldBlockFormat(
            existingContentMeta.hasExistingMeta
              ? replaceRegion(fileContent, blockContent)
              : `${fileContent}\n${blockContent}\n`
          )
        );
      }
    }
  }
  if (!opts.quiet) {
    console.log();
  }
}

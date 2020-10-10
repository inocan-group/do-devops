import { DevopsError, relativePath } from "../../../shared";
import {
  END_REGION,
  ExportAction,
  START_REGION,
  alreadyHasAutoindexBlock,
  communicateApi,
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

import chalk = require("chalk");
import { removeAllExtensions } from "./util";

/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
export async function processFiles(paths: string[], opts: IDictionary) {
  const results: IDictionary<string> = {};
  const defaultExclusions = ["index", "private"];
  const baseExclusions = opts.add
    ? defaultExclusions.concat((opts.add as string).split(",").map((i) => i.trim()))
    : defaultExclusions;

  for await (const path of paths) {
    const fileString = readFileSync(path, { encoding: "utf-8" });
    if (fileString.includes("// #autoindex") || fileString.includes("//#autoindex")) {
      results[path] = fileString;
    }
  }
  if (Object.keys(results).length === 0) {
    if (opts.withinMonorepo) {
      console.log(chalk`- No {italic autoindex} files found in this monorepo`);
      return;
    } else {
      communicateApi(paths);
    }
  } else {
    // iterate over each autoindex file
    for (const filePath of Object.keys(results)) {
      let fileContent = results[filePath];
      const excluded = exclusions(fileContent).concat(baseExclusions);
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
        exclusions(fileContent),
        opts
      )}\n${autoIndexContent}\n\n${AUTOINDEX_INFO_MSG}\n\n${END_REGION}`;

      const existingContentMeta = getExistingMetaInfo(fileContent);

      let exportAction: ExportAction;
      const bracketedMessages: string[] = [];
      if (exportType !== ExportType.named) {
        bracketedMessages.push(chalk`{grey using }{italic ${exportType}} {grey export}`);
      }

      if (autoIndexContent && alreadyHasAutoindexBlock(fileContent)) {
        if (
          noDifference(existingContentMeta.files, removeAllExtensions(exportableSymbols.files)) &&
          noDifference(existingContentMeta.dirs, removeAllExtensions(exportableSymbols.dirs)) &&
          noDifference(existingContentMeta.sfcs, removeAllExtensions(exportableSymbols.sfcs)) &&
          exportType === existingContentMeta.exportType &&
          noDifference(existingContentMeta.exclusions, excluded)
        ) {
          exportAction = ExportAction.noChange;
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
      } {blue ./${relativePath(filePath)}} ${bracketedMessage}`;

      const unchangedMessage = chalk`{dim - {italic no changes} to {blue ./${relativePath(
        filePath
      )}}} ${bracketedMessage}`;

      if (!opts.quiet && exportAction === ExportAction.noChange) {
        console.log(unchangedMessage);
      }
      if (exportAction !== ExportAction.noChange) {
        console.log(changeMessage);
        writeFileSync(
          filePath,
          existingContentMeta.hasExistingMeta
            ? replaceRegion(fileContent, blockContent)
            : fileContent.concat("\n" + blockContent) + "\n"
        );
      }
    }
  }
  if (!opts.quiet) {
    console.log();
  }
}

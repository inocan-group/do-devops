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
  structurePriorAutoindexContent,
  timestamp,
  unexpectedContent,
} from "./index";
import { readFileSync, writeFileSync } from "fs";

import { ExportType } from "./reference";
import { IDictionary } from "common-types";
import { namedOffsetExports } from "./export";

import chalk = require("chalk");

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
      console.log(chalk`- No {italic autoindex} files found`);
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

      let exportAction: ExportAction;
      if (autoIndexContent && alreadyHasAutoindexBlock(fileContent)) {
        const priorContent = structurePriorAutoindexContent(fileContent);
        const currentSymbols = exportableSymbols.files.concat(exportableSymbols.dirs).map((i) => i.replace(".ts", ""));
        if (
          priorContent.quantity === currentSymbols.length &&
          currentSymbols.every((i) => priorContent.symbols.includes(i))
        ) {
          exportAction = ExportAction.noChange;
        } else {
          exportAction = ExportAction.updated;
          fileContent = replaceRegion(fileContent, autoIndexContent);
        }
      } else if (autoIndexContent) {
        exportAction = ExportAction.added;
        fileContent = chalk`${fileContent}\n${START_REGION}\n${timestamp()}${autoIndexContent}\n${END_REGION}`;
      }

      // BUILD UP CLI MESSAGE
      const warnings = unexpectedContent(fileContent);
      const excludedWithoutBase = excluded.filter((i) => !baseExclusions.includes(i));
      const warningMessage = warnings
        ? chalk` {red has unexpected content: {italic {dim ${Object.keys(warnings).join(", ")} }}}`
        : "";
      const exclusionMessage =
        excludedWithoutBase.length > 0 ? chalk` {italic excluding: } {grey ${excludedWithoutBase.join(", ")}}` : "";
      const typeMessage =
        exportType === ExportType.named ? "" : chalk`{grey using }{italic ${exportType}} {grey export}`;

      const metaInfo =
        typeMessage && exclusionMessage
          ? chalk`{dim  [ ${typeMessage}; ${exclusionMessage} ]}`
          : typeMessage || exclusionMessage
          ? chalk`{dim  [ ${typeMessage}${exclusionMessage} ]}`
          : "";

      const changeMessage = chalk`- ${
        exportAction === ExportAction.added ? "added" : "updated"
      } index {blue ./${relativePath(filePath)}}${metaInfo}${warningMessage}`;
      const unchangedMessage = chalk`{dim - {italic no changes} to {blue ./${relativePath(filePath)}}}`;

      if (!opts.quiet && exportAction === ExportAction.noChange) {
        console.log(unchangedMessage);
      }
      if (exportAction !== ExportAction.noChange) {
        console.log(changeMessage);
        writeFileSync(filePath, fileContent);
      }
    }
  }
  if (!opts.quiet) {
    console.log();
  }
}

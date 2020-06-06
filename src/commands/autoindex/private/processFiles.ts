import {
  END_REGION,
  START_REGION,
  alreadyHasIndex,
  communicateApi,
  defaultExports,
  exclusions,
  exportable,
  namedExports,
  replaceRegion,
  timestamp,
  unexpectedContent,
} from "./index";
import { readFileSync, writeFileSync } from "fs";

import { IDictionary } from "common-types";
import { relativePath } from "../../../shared";

import chalk = require("chalk");

/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
export async function processFiles(paths: string[], opts: IDictionary) {
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

      const exportableFiles = await exportable(filePath, excluded);
      const autoIndexContent: string = fileContent.includes(":default")
        ? defaultExports(exportableFiles)
        : namedExports(exportableFiles);

      if (alreadyHasIndex(fileContent)) {
        fileContent = replaceRegion(fileContent, autoIndexContent);
        const warnings = unexpectedContent(fileContent);
        const warningMessage = warnings
          ? chalk` {red has unexpected content: {italic {dim ${Object.keys(warnings).join(", ")} }}}`
          : "";
        const exclusionMessage =
          excluded.length > 0 ? chalk` {dim [ {italic excluding: } {grey ${excluded.join(",")}} ]}` : "";
        console.log(chalk`- updated index {blue ./${relativePath(filePath)}}${exclusionMessage}${warningMessage}`);
      } else {
        fileContent = `${fileContent}\n${START_REGION}\n${timestamp()}${autoIndexContent}\n${END_REGION}`;
        console.log(chalk`- added index to {blue ./${relativePath(filePath)}}`);
      }
      writeFileSync(filePath, fileContent);
    }
  }
  console.log();
}

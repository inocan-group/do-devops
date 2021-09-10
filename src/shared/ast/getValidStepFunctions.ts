import chalk from "chalk";
import { sync } from "globby";
import path from "path";
import { IDictionary } from "common-types";
import { describe } from "native-dash";

import { astParseWithTypescript, astParseWithAcorn } from "./index";
import { fileIncludes, getFileComponents, toRelativePath, write } from "../file";
import { getDefaultExport } from "./getDefaultExport";

/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
export function getValidStepFunctions(opts: IDictionary = {}) {
  const allFiles = sync(path.join(process.env.PWD || "", "/src/**/*.ts"));
  return allFiles
    .filter((f) => fileIncludes(f, "StateMachine"))
    .reduce((agg: string[], curr) => {
      let ast;
      let status = "starting";
      try {
        write(
          getFileComponents(curr).fileWithoutExt + "-acorn.json",
          astParseWithAcorn({ filename: curr }).program.body.map((i: any) => ({
            type: i.type,
            description: Object.keys(i).map((k) => describe(k)),
          })),
          { allowOverwrite: true }
        );
        console.log({
          file: curr,
          parsed: getDefaultExport({ filename: curr }),
        });
        ast = astParseWithTypescript(curr);
        status = "file-parsed";
        if (!ast.program.body[0].source) {
          if (opts.verbose) {
            console.log(
              chalk`{grey - the file {blue ${toRelativePath(
                curr
              )}} has no source content; will be ignored}`
            );
          }

          return agg;
        }

        const loc = ast.program.body[0].source.loc;
        status = "loc-identified";
        const handler = loc.tokens.find((i: any) => i.value === "default");
        status = handler ? "found" : "missing";
        if (handler) {
          if (!Array.isArray(agg)) {
            throw new TypeError(
              `Found a Step Function but the file aggregation is not an array! ${handler}`
            );
          }
          agg.push(curr);
        }

        return agg;
      } catch (error) {
        console.log(
          chalk`- Error processing  {red ${toRelativePath(curr)}} [s: ${status}]: {grey ${
            (error as Error).message
          }}`
        );
        return agg;
      }
    }, []);
}

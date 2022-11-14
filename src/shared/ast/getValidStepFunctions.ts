import { globbySync } from "globby";
import { join } from "pathe";
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
  const allFiles = globbySync(join(process.env.PWD || "", "/src/**/*.ts"));
  return allFiles
    .filter((f) => fileIncludes(f, "StateMachine"))
    .reduce((agg: string[], cur: any) => {
      let ast;
      let status = "starting";
      try {
        write(
          getFileComponents(cur).fileWithoutExt + "-acorn.json",
          astParseWithAcorn({ filename: cur }).program.body.map((i: any) => ({
            type: i.type,
            description: Object.keys(i).map((k) => describe(k)),
          })),
          { allowOverwrite: true }
        );
        console.log({
          file: cur,
          parsed: getDefaultExport({ filename: cur }),
        });
        ast = astParseWithTypescript(cur);
        status = "file-parsed";
        if (!ast.program.body[0].source) {
          if (opts.verbose) {
            console.log(
              `{grey - the file {blue ${toRelativePath(
                cur
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
          agg.push(cur);
        }

        return agg;
      } catch (error) {
        console.log(
          `- Error processing  {red ${toRelativePath(cur)}} [s: ${status}]: {grey ${
            (error as Error).message
          }}`
        );
        return agg;
      }
    }, []);
}

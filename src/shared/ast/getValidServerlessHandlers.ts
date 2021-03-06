import chalk from "chalk";
import fg from "globby";
import path from "path";

import { astParseWithTypescript } from "./astParseWithTypescript";
import { toRelativePath } from "../file";
import { IDictionary } from "common-types";

/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
export function getValidServerlessHandlers(opts: IDictionary = {}) {
  const allFiles = fg.sync(path.join(process.env.PWD || "", "/src/**/*.ts"));
  return allFiles.reduce((agg: string[], curr) => {
    let ast;
    let status = "starting";
    try {
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
      const handler = loc.tokens.find((i: any) => i.value === "handler");
      status = handler ? "handler-found" : "handler-missing";
      if (handler) {
        if (!Array.isArray(agg)) {
          throw new TypeError(
            `Found a handler but somehow the file aggregation is not an array! ${handler}`
          );
        }
        agg.push(curr);
      }

      return agg;
    } catch (error) {
      console.log(
        chalk`- Error processing  {red ${toRelativePath(curr)}} [s: ${status}]: {grey ${
          error.message
        }}`
      );
      return agg;
    }
  }, []);
}

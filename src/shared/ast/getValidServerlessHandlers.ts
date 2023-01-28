import { globbySync as sync } from "globby";
import path from "node:path";

import { astParseWithTypescript } from "./astParseWithTypescript";
import { toRelativePath } from "../file";
import { IDictionary } from "common-types";
import chalk from "chalk";

/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
export function getValidServerlessHandlers(opts: IDictionary = {}) {
  const allFiles = sync(path.join(process.env.PWD || "", "/src/**/*.ts"));
  return allFiles.reduce((agg: string[], curr: any) => {
    let ast;
    let status = "starting";
    try {
      ast = astParseWithTypescript(curr);
      status = "file-parsed";
      if (!ast.program.body[0].source) {
        if (opts.verbose) {
          console.log(
            `{grey - the file ${chalk.blue(toRelativePath(curr))} has no source content; will be ignored}`
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
        `- Error processing  ${chalk.red(toRelativePath(curr))} [s: ${status}]: ${chalk.grey((error as Error).message)}`
      );
      return agg;
    }
  }, []);
}

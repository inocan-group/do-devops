import * as chalk from "chalk";
import * as fg from "fast-glob";
import * as path from "path";

import { parseFile } from "./parseFile";
import { relativePath } from "../file";

/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
export function getValidServerlessHandlers() {
  const allFiles = fg.sync(path.join(process.env.PWD, "/src/handlers/**/*.ts"));
  return allFiles.reduce((agg: string[], curr) => {
    let ast;
    let status = "starting";
    try {
      ast = parseFile(curr);
      status = "file-parsed";
      if (!ast.program.body[0].source) {
        console.log(chalk`{grey - the file {blue ${relativePath(curr)}} has no source content; will be ignored}`);

        return agg;
      }
      const loc = ast.program.body[0].source.loc;
      status = "loc-identified";
      const handler = loc.tokens.find((i: any) => i.value === "handler");
      status = handler ? "handler-found" : "handler-missing";
      if (handler) {
        if (!Array.isArray(agg)) {
          throw new Error(`Found a handler but somehow the file aggregation is not an array! ${handler}`);
        }
        agg.push(curr);
      }

      return agg;
    } catch (e) {
      console.log(chalk`- Error processing  {red ${relativePath(curr)}} [s: ${status}]: {grey ${e.message}}`);
      return agg;
    }
  }, []);
}

import path from "path";
import { parseFile } from "./parseFile";
import fg from "fast-glob";
import chalk from "chalk";
import { relativePath } from "../file";

/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
export function getValidServerlessHandlers() {
  const allFiles = fg.sync(path.join(process.env.PWD, "/src/handlers/**/*.ts"));
  return allFiles.reduce((agg: string[], curr) => {
    let ast;
    try {
      ast = parseFile(curr);
      if (!ast.program.body[0].source) {
        console.log(
          chalk`{grey - the file {blue ${relativePath(
            curr
          )}} has no source content; will be ignored}`
        );

        return agg;
      }
      const loc = ast.program.body[0].source.loc;
      if (loc.tokens.find((i: any) => i.value === "handler")) {
        agg.push(curr);
      }

      return agg;
    } catch (e) {
      console.log(
        chalk`- Error processing the file {red ${relativePath(curr)}}: ${
          e.message
        }`
      );
    }
  }, []);
}

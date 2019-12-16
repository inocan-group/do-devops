import path from "path";
import { parseFile } from "./parseFile";
import fg from "fast-glob";

/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
export function getValidServerlessHandlers() {
  const allFiles = fg.sync(path.join(process.env.PWD, "/src/handlers/**/*.ts"));
  return allFiles.reduce((agg: string[], curr) => {
    const ast = parseFile(curr);
    const loc = ast.program.body[0].source.loc;
    if (loc.tokens.find((i: any) => i.value === "handler")) {
      agg.push(curr);
    }

    return agg;
  }, []);
}

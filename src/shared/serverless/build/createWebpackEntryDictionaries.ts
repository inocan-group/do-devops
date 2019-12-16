import * as path from "path";
import { IDictionary } from "common-types";
import { write } from "../../file/write";

/**
 * Webpack can create named multiple entry points if the `entry` parameter
 * is passed a dictionary where the key is the module name (in Serverless
 * this would be the handler's name) and the value is then the full path to
 * the file.
 *
 * This function will, given a path to the source typescript files, produce
 * two dictionaries:
 *
 * 1. `webpack.ts-entry-points.json` - a dictionary that points to the handler's
 * typescript source
 * 2. `webpack.js-entry-points.json` - a dictionary that points to webpack's outputted
 * javascript files
 *
 * If you are using the `serverless-webpack` plugin you should use the former, if you
 * are managing the webpack process yourself then the latter is likely more appropriate.
 */
export async function createWebpackEntryDictionaries(handlerFns: string[]) {
  const data = handlerFns.reduce((agg: IDictionary[], f: string) => {
    const fn = f
      .split("/")
      .pop()
      .replace(".ts", "");
    const tsPath = "./" + path.relative(process.cwd(), f);
    const jsPath = tsPath
      .replace("src/handlers", ".webpack")
      .replace(".ts", ".js");

    return agg.concat({ fn, tsPath, jsPath });
  }, []);

  await Promise.all([
    write("webpack.ts-entry-points.json", data.reduce(useKey("tsPath"), {})),
    write("webpack.js-entry-points.json", data.reduce(useKey("jsPath"), {}))
  ]);
}

interface IEntryData {
  fn: string;
  tsPath: string;
  jsPath: string;
}

export function useKey(key: "jsPath" | "tsPath") {
  return (
    agg: IDictionary<string>,
    curr: { fn: string; tsPath: string; jsPath: string }
  ) => {
    agg[curr.fn] = curr[key];
    return agg;
  };
}

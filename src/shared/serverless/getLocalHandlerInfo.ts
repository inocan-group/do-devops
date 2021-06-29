/* eslint-disable unicorn/consistent-function-scoping */
import { getValidServerlessHandlers } from "../ast/index";
import { fileInfo, filesExist } from "../file";
import path from "path";
import { get } from "native-dash";
import { IWebpackHandlerDates } from "~/@types";

let _cache: IWebpackHandlerDates[];

/**
 * Based on the inline serverless functions, it gets the following:
 *
 * 1. `fn` - the function name _without_ file path or extension
 * 2. `source` - path -- including filename -- of the source file
 * 3. `sourceModified` - the date the source was last modified
 * 4. `webpack` - the path and filename to the transpiled webpack code
 * 5. `webpackModified` - the date the webpack transpiled code was last modified
 *
 * **Note:** this function _caches_ results for better performance but you
 * can break the cache by send in a `true` value to the `breakCache` parameter.
 */
export async function getLocalHandlerInfo(breakCache: boolean = false): Promise<IWebpackHandlerDates[]> {
  if (_cache && !breakCache) {
    return _cache;
  }

  const sourcePaths = getValidServerlessHandlers();
  const convertToWebpackPath = (source: string) =>
    path.join(process.cwd(), ".webpack", (source.split("/").pop() || "").replace(".ts", ".js"));
  const webpackPaths = sourcePaths.map((i) => convertToWebpackPath(i));
  const sourceInfo = await fileInfo(...sourcePaths);
  // some handlers may not have been transpiled yet
  const webpackFilesExist = filesExist(...webpackPaths);
  const webpackInfo = webpackFilesExist ? await fileInfo(...webpackFilesExist) : [];

  return sourceInfo.reduce((agg: IWebpackHandlerDates[], source) => {
    return {
      ...agg,
      fn: source.filename,
      source: source.filepath,
      sourceModified: source.mtime,
      webpack: convertToWebpackPath(source.filepath),
      webpackModified: get(
        webpackInfo.find((w) => w.filename === source.filename) || {},
        "stats.mtime",
        new Date("1970-01-01")
      ),
    };
  }, []);
}

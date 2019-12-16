import { getValidServerlessHandlers } from "../ast/index";
import { filesInfo } from "../file";
import { join } from "path";
import get = require("lodash.get");

export interface IHandlerInfo {
  /** the function name (no _path_ or _file extension_) */
  fn: string;
  /**
   * the fully qualified _path_ and _filename_ to the source file
   */
  source: string;
  /**
   * date/time the source file was last modified
   */
  sourceModified: Date;
  /**
   * the fully qualified _path_ and _filename_ to the **webpack** transpiled file;
   * blank if this doesn't exist
   */
  webpack: string;
  /**
   * the date/time the transpiled file was last modified
   */
  webpackModified: Date;
}

let _cache: IHandlerInfo[];

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
export function getLocalHandlerInfo(
  breakCache: boolean = false
): IHandlerInfo[] {
  if (_cache && !breakCache) {
    return _cache;
  }

  const sourcePaths = getValidServerlessHandlers();
  const convertToWebpackPath = (source: string) =>
    join(
      process.cwd(),
      ".webpack",
      source
        .split("/")
        .pop()
        .replace(".ts", ".js")
    );
  const webpackPaths = sourcePaths.map(i => convertToWebpackPath(i));
  const sourceInfo = filesInfo(...sourcePaths);
  const webpackInfo = filesInfo(...webpackPaths);

  return sourceInfo.reduce((agg: IHandlerInfo[], source) => {
    return agg.concat({
      fn: source.fileName,
      source: source.filePath,
      sourceModified: source.stats.mtime,
      webpack: convertToWebpackPath(source.filePath),
      webpackModified: get(
        webpackInfo.find(w => w.fileName === source.fileName) || {},
        "stats.mtime",
        new Date("1970-01-01")
      )
    });
  }, []);
}

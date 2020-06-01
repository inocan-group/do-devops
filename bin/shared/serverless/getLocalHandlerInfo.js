"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalHandlerInfo = void 0;
const index_1 = require("../ast/index");
const file_1 = require("../file");
const path_1 = require("path");
const get = require("lodash.get");
let _cache;
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
function getLocalHandlerInfo(breakCache = false) {
    if (_cache && !breakCache) {
        return _cache;
    }
    const sourcePaths = index_1.getValidServerlessHandlers();
    const convertToWebpackPath = (source) => path_1.join(process.cwd(), ".webpack", source
        .split("/")
        .pop()
        .replace(".ts", ".js"));
    const webpackPaths = sourcePaths.map(i => convertToWebpackPath(i));
    const sourceInfo = file_1.filesInfo(...sourcePaths);
    // some handlers may not have been transpiled yet
    const webpackFilesExist = file_1.filesExist(...webpackPaths);
    const webpackInfo = webpackFilesExist ? file_1.filesInfo(...webpackFilesExist) : [];
    return sourceInfo.reduce((agg, source) => {
        return agg.concat({
            fn: source.fileName,
            source: source.filePath,
            sourceModified: source.stats.mtime,
            webpack: convertToWebpackPath(source.filePath),
            webpackModified: get(webpackInfo.find(w => w.fileName === source.fileName) || {}, "stats.mtime", new Date("1970-01-01"))
        });
    }, []);
}
exports.getLocalHandlerInfo = getLocalHandlerInfo;

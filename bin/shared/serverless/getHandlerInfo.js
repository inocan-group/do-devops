"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../ast/index");
/**
 * Based on the inline serverless functions, it gets the following:
 *
 * 1. `fn` - the function name _without_ file path or extension
 * 2. `source` - path -- including filename -- of the source file
 * 3. `webpack` - the path and filename to the transpiled webpack code
 *
 * **Note:** this function _caches_ results for better performance but you
 * can break the cache by send in a `true` value to the `breakCache` parameter.
 */
function getLocalHandlerInfo() {
    const sourcePaths = index_1.getValidServerlessHandlers();
    return sourcePaths.map(source => {
        const fn = source
            .split("/")
            .pop()
            .replace(".ts", "");
        return {
            source,
            fn,
            webpack: `.webpack/${fn}.js`
        };
    });
}
exports.getLocalHandlerInfo = getLocalHandlerInfo;

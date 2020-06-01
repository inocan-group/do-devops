"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInlineFunctionDefnFiles = void 0;
const fg = require("fast-glob");
const path = require("path");
/**
 * **findInlineFunctionDefnFiles**
 *
 * Returns an array of `*.defn.ts` files
 *
 * @param basePath you can optionally express where to start looking for config files
 * instead of the default of `${PWD}/src`
 */
function findInlineFunctionDefnFiles(basePath) {
    const glob = basePath ? path.join(basePath, "/**/*.defn.ts") : path.join(process.env.PWD, "/src/**/*.defn.ts");
    return fg.sync([glob]);
}
exports.findInlineFunctionDefnFiles = findInlineFunctionDefnFiles;

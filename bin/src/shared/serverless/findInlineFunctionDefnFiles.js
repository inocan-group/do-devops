"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
/**
 * **findInlineFunctionDefnFiles**
 *
 * Returns an array of `*.defn.ts` files
 *
 * @param basePath you can optionally express where to start looking for config files
 * instead of the default of `${PWD}/src`
 */
function findInlineFunctionDefnFiles(basePath) {
    const glob = basePath
        ? path_1.default.join(basePath, "/**/*.defn.ts")
        : path_1.default.join(process.env.PWD, "/src/**/*.defn.ts");
    return fast_glob_1.default.sync([glob]);
}
exports.findInlineFunctionDefnFiles = findInlineFunctionDefnFiles;

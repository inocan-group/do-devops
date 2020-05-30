"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const packageJsonCache_1 = require("./cache/packageJsonCache");
let _cache;
/**
 * returns `package.json` of the local repo as a typed object
 */
function getPackageJson(pathOverride) {
    if (packageJsonCache_1.getLocalPackageJson()) {
        return packageJsonCache_1.getLocalPackageJson();
    }
    const filename = path.join(pathOverride || process.cwd(), "package.json");
    return JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
}
exports.getPackageJson = getPackageJson;

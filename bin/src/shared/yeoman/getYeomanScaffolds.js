"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYeomanScaffolds = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Get's the name(s) of the scaffolding repo(s) used for the given project. The return
 * is always an array of strings; if no scaffold is found then the array will be empty.
 *
 * Note: it is _possible_ that there is more than one but this would be considered
 * highly unusual.
 */
function getYeomanScaffolds() {
    const yoFile = path_1.join(process.cwd(), ".yo-rc.json");
    const hasYo = fs_1.existsSync(yoFile);
    if (!hasYo) {
        return [];
    }
    return Object.keys(JSON.parse(fs_1.readFileSync(yoFile, "utf-8")));
}
exports.getYeomanScaffolds = getYeomanScaffolds;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonoRepoPackages = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Gives back a list of packages in the monorepo. If the
 * "packages" directory does not exist then it will return
 * `false`, if there _is_ a packages directory but no sub-directories
 * you'll just get an empty array.
 */
function getMonoRepoPackages(baseDir) {
    const dir = path_1.join(baseDir, "packages");
    if (!fs_1.existsSync(dir)) {
        return false;
    }
    return fs_1.readdirSync(dir, { withFileTypes: true })
        .filter((i) => i.isDirectory())
        .map((i) => i.name);
}
exports.getMonoRepoPackages = getMonoRepoPackages;

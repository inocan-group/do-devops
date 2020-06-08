"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesExist = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Checks all the files to see if they exist in the file system.
 * If none do then it returns false, if some do then it returns
 * an array of those which _do_ exist.
 *
 * @param files the files to be checked for existance
 */
function filesExist(...files) {
    const exists = [];
    files.forEach(f => {
        if (![".", "/"].includes(f.slice(0, 1))) {
            f = path_1.join(process.cwd(), f);
        }
        if (fs_1.existsSync(f)) {
            exists.push(f);
        }
    });
    return exists.length > 0 ? exists : false;
}
exports.filesExist = filesExist;

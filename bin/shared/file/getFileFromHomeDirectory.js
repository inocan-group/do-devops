"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileFromHomeDirectory = void 0;
const fs_1 = require("fs");
const errors_1 = require("../errors");
const path_1 = require("path");
function getFileFromHomeDirectory(filename, ignoreMissing = false) {
    const homedir = require("os").homedir();
    const fqName = path_1.join(homedir, filename);
    if (!fs_1.existsSync(fqName)) {
        if (ignoreMissing) {
            return false;
        }
        throw new errors_1.DevopsError(`Attempt to load the file "${filename}" from the user's home directory has failed as the file does not exist!`, "does-not-exist");
    }
    return fs_1.readFileSync(fqName, "utf-8");
}
exports.getFileFromHomeDirectory = getFileFromHomeDirectory;

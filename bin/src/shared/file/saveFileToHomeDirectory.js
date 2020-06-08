"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFileToHomeDirectory = void 0;
const fs_1 = require("fs");
const private_1 = require("../../private");
const path_1 = require("path");
function saveFileToHomeDirectory(filename, data, overwrite = true) {
    const homedir = require("os").homedir();
    const fqName = path_1.join(homedir, filename);
    const allowWrite = overwrite || !fs_1.existsSync(fqName);
    if (!allowWrite) {
        throw new private_1.DevopsError(`Attempt to write file "${filename}" to user's home directory will not be allowed as the file already exists!`, "not-allowed");
    }
    fs_1.writeFileSync(fqName, typeof data === "string" ? data : JSON.stringify(data));
}
exports.saveFileToHomeDirectory = saveFileToHomeDirectory;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const errors_1 = require("../errors");
/**
 * Runs **Node**'s `stat()` function across an array of functions
 *
 * @param files the list of files to **stat**. The files will automatically
 * be associated with the current working directory unless the filenames start
 * with a `/`.
 */
function filesInfo(...files) {
    let rememberFile;
    try {
        return files.reduce((agg, filePath) => {
            rememberFile = filePath;
            const stats = fs_1.statSync(filePath.slice(0, 1) !== "/" ? path_1.join(process.cwd(), filePath) : filePath);
            const pathParts = filePath.split("/");
            const file = pathParts.pop();
            const path = pathParts.slice(0, pathParts.length - 1).join("/");
            const nameParts = file.split(".");
            const fileName = nameParts.slice(0, nameParts.length - 1).join(".");
            const extension = nameParts.pop();
            return agg.concat({ filePath, path, fileName, file, extension, stats });
        }, []);
    }
    catch (e) {
        throw new errors_1.DevopsError(`Attempt to get info/stat from the file "${rememberFile}" [ ${path_1.join(process.cwd(), rememberFile)} ] failed [ call included request for ${files.length} files ]: ${e.message}`, "do-devops/filesInfo");
    }
}
exports.filesInfo = filesInfo;

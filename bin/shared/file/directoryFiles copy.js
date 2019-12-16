"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const errors_1 = require("../errors");
function directoryFiles(dir) {
    try {
        const files = fs_1.readdirSync(path_1.join(process.cwd(), dir));
        return files.reduce((agg, file) => {
            const stats = fs_1.statSync(path_1.join(process.cwd(), dir, file));
            return agg.concat({ file, stats });
        }, []);
    }
    catch (e) {
        throw new errors_1.DevopsError(`Attempt to get files from the directory "${dir}" [ ${path_1.join(process.cwd(), dir)} ] failed: ${e.message}`, "do-devops/directoryFiles");
    }
}
exports.directoryFiles = directoryFiles;

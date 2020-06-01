"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldFiles = void 0;
const path = require("path");
const fs_1 = require("fs");
const async_shelljs_1 = require("async-shelljs");
function clearOldFiles() {
    const typeFile = path.join(process.env.PWD, "src/@types/fns.ts");
    const inlineFile = path.join(process.env.PWD, "serverless-config/functions/inline.ts");
    const webpackFile = path.join(process.env.PWD, "serverless-config/functions/webpack.ts");
    const files = [typeFile, inlineFile, webpackFile];
    files.forEach((f) => {
        if (fs_1.existsSync(f)) {
            async_shelljs_1.rm(f);
        }
    });
}
exports.clearOldFiles = clearOldFiles;

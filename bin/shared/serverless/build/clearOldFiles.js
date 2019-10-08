"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const async_shelljs_1 = require("async-shelljs");
const path_1 = __importDefault(require("path"));
function clearOldFiles() {
    const typeFile = path_1.default.join(process.env.PWD, "src/@types/fns.ts");
    const inlineFile = path_1.default.join(process.env.PWD, "serverless-config/functions/inline.ts");
    const webpackFile = path_1.default.join(process.env.PWD, "serverless-config/functions/webpack.ts");
    const files = [typeFile, inlineFile, webpackFile];
    files.forEach(f => {
        if (fs_1.existsSync(f)) {
            async_shelljs_1.rm(f);
        }
    });
}
exports.clearOldFiles = clearOldFiles;

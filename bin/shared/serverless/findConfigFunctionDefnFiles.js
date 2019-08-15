"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
/**
 * Finds all function configuration files in the `typescript-microservice`
 * configuration directory.
 */
function findConfigFunctionDefnFiles(basePath) {
    const glob = basePath
        ? path_1.default.join(basePath, "*.ts")
        : path_1.default.join(process.env.PWD, "/serverless-config/functions/**/*.ts");
    return fast_glob_1.default.sync([
        glob,
        path_1.default.join(basePath || process.env.PWD, "serverless-config/functions.ts")
    ]);
}
exports.findConfigFunctionDefnFiles = findConfigFunctionDefnFiles;

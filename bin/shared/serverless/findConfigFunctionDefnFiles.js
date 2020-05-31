"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fg = require("fast-glob");
const path = require("path");
/**
 * Finds all function configuration files in the `typescript-microservice`
 * configuration directory.
 */
function findConfigFunctionDefnFiles(basePath) {
    const glob = basePath
        ? path.join(basePath, "*.ts")
        : path.join(process.env.PWD, "/serverless-config/functions/**/*.ts");
    return fg.sync([glob, path.join(basePath || process.env.PWD, "serverless-config/functions.ts")]);
}
exports.findConfigFunctionDefnFiles = findConfigFunctionDefnFiles;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fg = require("fast-glob");
const path = require("path");
const parseFile_1 = require("./parseFile");
const file_1 = require("../file");
/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
function getValidServerlessHandlers() {
    const allFiles = fg.sync(path.join(process.env.PWD, "/src/handlers/**/*.ts"));
    return allFiles.reduce((agg, curr) => {
        let ast;
        let status = "starting";
        try {
            ast = parseFile_1.parseFile(curr);
            status = "file-parsed";
            if (!ast.program.body[0].source) {
                console.log(chalk `{grey - the file {blue ${file_1.relativePath(curr)}} has no source content; will be ignored}`);
                return agg;
            }
            const loc = ast.program.body[0].source.loc;
            status = "loc-identified";
            const handler = loc.tokens.find((i) => i.value === "handler");
            status = handler ? "handler-found" : "handler-missing";
            if (handler) {
                if (!Array.isArray(agg)) {
                    throw new Error(`Found a handler but somehow the file aggregation is not an array! ${handler}`);
                }
                agg.push(curr);
            }
            return agg;
        }
        catch (e) {
            console.log(chalk `- Error processing  {red ${file_1.relativePath(curr)}} [s: ${status}]: {grey ${e.message}}`);
            return agg;
        }
    }, []);
}
exports.getValidServerlessHandlers = getValidServerlessHandlers;

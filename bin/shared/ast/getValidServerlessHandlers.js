"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const parseFile_1 = require("./parseFile");
const fast_glob_1 = __importDefault(require("fast-glob"));
const chalk_1 = __importDefault(require("chalk"));
const file_1 = require("../file");
/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
function getValidServerlessHandlers() {
    const allFiles = fast_glob_1.default.sync(path_1.default.join(process.env.PWD, "/src/handlers/**/*.ts"));
    return allFiles.reduce((agg, curr) => {
        let ast;
        try {
            ast = parseFile_1.parseFile(curr);
            if (!ast.program.body[0].source) {
                console.log(chalk_1.default `{grey - the file {blue ${file_1.relativePath(curr)}} has no source content; will be ignored}`);
                return agg;
            }
            const loc = ast.program.body[0].source.loc;
            if (loc.tokens.find((i) => i.value === "handler")) {
                agg.push(curr);
            }
            return agg;
        }
        catch (e) {
            console.log(chalk_1.default `- Error processing the file {red ${file_1.relativePath(curr)}}: ${e.message}`);
        }
    }, []);
}
exports.getValidServerlessHandlers = getValidServerlessHandlers;

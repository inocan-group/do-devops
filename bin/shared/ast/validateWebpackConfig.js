"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWebpackConfig = void 0;
// import { readFileSync } from "fs";
const path_1 = require("path");
const index_1 = require("./index");
/**
 * Validates that the webpack config:
 *
 * 1. has a `modules.exports` declaration
 * 2. is a functional representation and the function takes a `fns` parameter
 * 3. warns to CLI if there is no `options` parameter
 *
 * @param filename optionally override the default webpack config filename
 */
function validateWebpackConfig(filename = "webpack.config.js") {
    const config = index_1.parseFile(path_1.join(process.cwd(), filename));
    console.log(config.program.body);
}
exports.validateWebpackConfig = validateWebpackConfig;

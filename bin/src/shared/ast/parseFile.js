"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = void 0;
const recast = require("recast");
const fs_1 = require("fs");
/**
 * parses a given file (_path_ and _file_ name) into an AST
 * tree
 */
function parseFile(filename) {
    const fileContents = fs_1.readFileSync(filename, {
        encoding: "utf-8"
    });
    return filename.includes(".ts")
        ? recast.parse(fileContents, {
            parser: require("recast/parsers/typescript")
        })
        : recast.parse(fileContents);
}
exports.parseFile = parseFile;

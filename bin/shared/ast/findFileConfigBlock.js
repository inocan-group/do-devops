"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
/**
 * Given a handler file, this will return the object key/value
 * pairs of the file's `config` export.
 */
function findHandlerConfig(filename) {
    const ast = index_1.parseFile(filename);
    return index_1.namedExports(ast).find(i => i.name === "config").properties;
}
exports.findHandlerConfig = findHandlerConfig;

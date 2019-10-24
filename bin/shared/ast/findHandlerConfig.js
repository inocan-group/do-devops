"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
/**
 * Given a handler file, this will return the object key/value
 * pairs of the file's `config` export. It will also provide a
 * list of functions who's `config` export did _not_ expressly
 * type the config as `IWrapperFunction`
 */
function findHandlerConfig(filename) {
    const ast = index_1.parseFile(filename);
    const hash = {};
    const config = index_1.namedExports(ast).find(i => i.name === "config");
    config.properties.forEach(i => {
        hash[i.name] = i.value;
    });
    hash.handler = filename;
    return {
        interface: config.interface,
        config: hash
    };
}
exports.findHandlerConfig = findHandlerConfig;

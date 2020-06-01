"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findHandlerConfig = void 0;
const chalk = require("chalk");
const index_1 = require("./index");
/**
 * Given a handler file, this will return the object key/value
 * pairs of the file's `config` export. It will also provide a
 * list of functions who's `config` export did _not_ expressly
 * type the config as `IWrapperFunction`
 */
function findHandlerConfig(filename, 
/** the _package_ section should be replaced with a reference to the `filename.zip` */
isWebpackZip = false) {
    const ast = index_1.parseFile(filename);
    const hash = {};
    const config = index_1.namedExports(ast).find((i) => i.name === "config");
    if (!config) {
        return;
    }
    else {
        const fn = filename.split("/").pop().replace(".ts", "");
        config.properties.forEach((i) => {
            hash[i.name] = i.value;
        });
        hash.handler = isWebpackZip ? `.webpack/${fn}.handler` : filename.replace(".ts", ".handler");
        if (isWebpackZip) {
            if (hash.package) {
                console.log(chalk `{grey - the handler function "${fn}" had a defined package config but it will be replaced by a {italic artifact} reference}`);
            }
            hash.package = { artifact: `.webpack/${fn}.zip` };
        }
        return {
            interface: config.interface,
            config: hash,
        };
    }
}
exports.findHandlerConfig = findHandlerConfig;

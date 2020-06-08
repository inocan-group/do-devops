"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedExports = void 0;
const index_1 = require("../index");
const shared_1 = require("../../../../shared");
/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
function namedExports(exportable) {
    const contentLines = [];
    exportable.files.forEach((file) => {
        contentLines.push(`export * from "./${shared_1.exportsAsEsm() ? index_1.removeExtension(file) + ".js" : index_1.removeExtension(file)}";`);
    });
    if (exportable.dirs.length > 0) {
        contentLines.push(`// directory exports`);
    }
    exportable.dirs.forEach((dir) => {
        contentLines.push(`export * from "./${dir}/index${shared_1.exportsAsEsm() ? ".js" : ""}";`);
    });
    return contentLines.join("\n");
}
exports.namedExports = namedExports;

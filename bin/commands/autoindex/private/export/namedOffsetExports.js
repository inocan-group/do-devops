"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedOffsetExports = void 0;
const index_1 = require("../index");
/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
function namedOffsetExports(exportable, opts = {}) {
    const contentLines = [];
    if (exportable.files.length > 0) {
        contentLines.push(`// local file exports`);
    }
    exportable.files.forEach((file) => {
        contentLines.push(`export * as ${index_1.removeExtension(file, true)} from "./${opts.preserveExtension ? index_1.removeExtension(file) + ".js" : index_1.removeExtension(file)}";`);
    });
    if (exportable.dirs.length > 0) {
        contentLines.push(`// directory exports`);
    }
    exportable.dirs.forEach((dir) => {
        contentLines.push(`export * as ${index_1.removeExtension(dir, true)} from "./${dir}/index${opts.preserveExtension ? ".js" : ""}";`);
    });
    return contentLines.join("\n");
}
exports.namedOffsetExports = namedOffsetExports;

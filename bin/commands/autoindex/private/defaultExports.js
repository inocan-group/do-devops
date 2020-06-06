"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultExports = void 0;
const index_1 = require("./index");
/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
function defaultExports(exportable) {
    const contentLines = [];
    exportable.files.forEach((file) => {
        contentLines.push(`export { default as ${index_1.removeExtension(file, true)} } from "./${index_1.removeExtension(file)}";`);
    });
    exportable.dirs.forEach((dir) => {
        contentLines.push(`export * from "${dir}/index";`);
    });
    return contentLines.join("\n");
}
exports.defaultExports = defaultExports;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFilesOfType = void 0;
const globby = require("globby");
const path_1 = require("path");
/**
 * Returns a list of files of a particular type/extention. This list of files will
 * originate off of the `src` directory or whatever directory you state as the `dir`.
 *
 * @param type the type/extension of the file you are looking for
 * @param dir the directory to look in; by default will look in `src` off the repo's roote
 */
function getAllFilesOfType(type, dir = "src") {
    const directory = dir.slice(0, 1) === "/" ? dir : path_1.join(process.cwd(), dir);
    return globby.sync([`${directory}/**/*.${type}`]);
}
exports.getAllFilesOfType = getAllFilesOfType;

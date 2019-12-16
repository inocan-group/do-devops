"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const globby_1 = __importDefault(require("globby"));
/**
 * Returns a list of files of a particular type/extention. This list of files will
 * originate off of the `src` directory or whatever directory you state as the `dir`.
 *
 * @param type the type/extension of the file you are looking for
 * @param dir the directory to look in; by default will look in `src` off the repo's roote
 */
function getAllFilesOfType(type, dir = "src") {
    const directory = dir.slice(0, 1) === "/" ? dir : path_1.join(process.cwd(), dir);
    return globby_1.default.sync([`${directory}/**/*.${type}`]);
}
exports.getAllFilesOfType = getAllFilesOfType;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const errors_1 = require("../errors");
const path_1 = require("path");
const w = util_1.promisify(fs_1.writeFile);
/**
 * **write**
 *
 * Writes a file to the filesystem; favoring files which are based off the repo's
 * root
 *
 * @param filename the filename to be written; if filename doesn't start with either a '.' or '/' then it will be joined with the projects current working directory
 * @param data the data to be written
 */
function write(filename, data, spacing = 2) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof data !== "string") {
                data =
                    spacing && spacing > 0
                        ? JSON.stringify(data, null, spacing)
                        : JSON.stringify(data);
            }
            if (![".", "/"].includes(filename.slice(0, 1))) {
                filename = path_1.join(process.cwd(), filename);
            }
            yield w(filename, data, { encoding: "utf-8" });
            return { filename, data };
        }
        catch (e) {
            throw new errors_1.DevopsError(`Problem writing file "${filename}": ${e.message}`, "do-devops/can-not-write");
        }
    });
}
exports.write = write;

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
const filesExist_1 = require("./filesExist");
const r = util_1.promisify(fs_1.readFile);
/**
 * **read**
 *
 * Reads a file to the filesystem; default to files which are based off the repo's
 * root
 *
 * @param filename the filename to be read; if filename doesn't start with either a '/' then it will be joined with the project's current working directory
 */
function read(filename, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof data !== "string") {
                data =
                    options.spacing && options.spacing > 0
                        ? JSON.stringify(data, null, options.spacing)
                        : JSON.stringify(data);
            }
            if (![".", "/"].includes(filename.slice(0, 1))) {
                filename = path_1.join(process.cwd(), filename);
            }
            let offset;
            while (options.offsetIfExists && (yield filesExist_1.filesExist(filename))) {
                const before = new RegExp(`-${offset}.(.*)$`);
                filename = offset ? filename.replace(before, ".$1") : filename;
                offset = !offset ? 1 : offset++;
                const after = new RegExp(`-${offset}$`);
                const parts = filename.split(".");
                filename =
                    parts.slice(0, parts.length - 1).join(".") +
                        `-${offset}.` +
                        parts.slice(-1);
            }
            yield w(filename, data, {
                encoding: "utf-8"
            });
            return { filename, data };
        }
        catch (e) {
            throw new errors_1.DevopsError(`Problem writing file "${filename}": ${e.message}`, "do-devops/can-not-write");
        }
    });
}
exports.read = read;

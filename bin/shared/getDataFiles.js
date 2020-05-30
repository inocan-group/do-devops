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
const fg = require("fast-glob");
const path = require("path");
const process = require("process");
/**
 * Gets a list of data files from the
 * `test/data` directory.
 */
function getDataFiles(opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const glob = path.join(process.cwd(), "test/data", opts.fileType ? `**/*.${opts.fileType}` : `**/*`);
        const results = yield fg(glob);
        return strip(opts)(results);
    });
}
exports.getDataFiles = getDataFiles;
function strip(opts) {
    return (results) => {
        if (opts.filterBy) {
            results = results.filter((i) => i.includes(opts.filterBy));
        }
        if (opts.stripFileExtension) {
            results = results.map((i) => i.replace(/(.*)\.\w*$/, "$1"));
        }
        const prefix = process.cwd() + "/test/data/";
        return results.map((i) => i.replace(prefix, ""));
    };
}

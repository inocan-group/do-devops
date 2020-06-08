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
exports.exportable = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const globby = require("globby");
/**
 * determines the files and directories in a _given directory_ that should be included in the index file
 */
function exportable(filePath, excluded) {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = path_1.dirname(filePath);
        const thisFile = path_1.basename(filePath);
        const exclusions = excluded.concat(thisFile).concat(["index.js", "index.ts"]);
        const files = (yield globby([`${dir}/*.ts`, `${dir}/*.js`]))
            .filter((file) => !exclusions.includes(path_1.basename(file)))
            .map((i) => path_1.basename(i));
        const dirs = [];
        fs_1.readdirSync(dir, { withFileTypes: true })
            .filter((i) => i.isDirectory())
            .map((i) => {
            if (fs_1.existsSync(path_1.join(dir, i.name, "index.ts"))) {
                dirs.push(i.name);
            }
            else if (fs_1.existsSync(path_1.join(dir, i.name, "index.js"))) {
                dirs.push(i.name);
            }
        });
        return { files, base: dir, dirs };
    });
}
exports.exportable = exportable;

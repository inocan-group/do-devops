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
const path_1 = require("path");
const existance = util_1.promisify(fs_1.exists);
/**
 * Checks all the files to see if they exist in the file system.
 * If none do then it returns false, if some do then it returns
 * an array of those which _do_ exist.
 *
 * @param files the files to be checked for existance
 */
function filesExist(...files) {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = [];
        const promises = [];
        files.forEach(f => {
            if (![".", "/"].includes(f.slice(0, 1))) {
                f = path_1.join(process.cwd(), f);
            }
            promises.push(existance(f).then(i => (i ? exists.push(f) : null)));
        });
        yield Promise.all(promises);
        return exists.length > 0 ? exists : false;
    });
}
exports.filesExist = filesExist;

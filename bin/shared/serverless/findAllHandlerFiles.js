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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fg = require("fast-glob");
const path = require("path");
/**
 * Finds all typescript files in the `src/handlers`
 * directory which have a **handler** export.
 */
function findAllHandlerFiles() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const glob = path.join(process.env.PWD, "/src/handlers/**/*.ts");
        const files = fg.sync(glob);
        const handlers = [];
        console.log(files);
        try {
            for (var files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), !files_1_1.done;) {
                const file = files_1_1.value;
                console.log(file);
                const ref = yield Promise.resolve().then(() => require(file));
                if (ref.handler) {
                    handlers.push({ file, ref });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (files_1_1 && !files_1_1.done && (_a = files_1.return)) yield _a.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log(handlers.map((i) => i.file));
    });
}
exports.findAllHandlerFiles = findAllHandlerFiles;

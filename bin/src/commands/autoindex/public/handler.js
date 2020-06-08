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
exports.handler = void 0;
const chalk = require("chalk");
const globby = require("globby");
const index_1 = require("../private/index");
const shared_1 = require("../../../shared");
const path_1 = require("path");
/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
function handler(argv, opts) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const globInclude = opts.glob ? opts.glob.concat("!node_modules") : false;
        const monoRepoPackages = shared_1.getMonoRepoPackages(process.cwd());
        if (monoRepoPackages) {
            const response = yield index_1.askHowToHandleMonoRepoIndexing(monoRepoPackages);
            if (response === "ALL") {
                try {
                    for (var monoRepoPackages_1 = __asyncValues(monoRepoPackages), monoRepoPackages_1_1; monoRepoPackages_1_1 = yield monoRepoPackages_1.next(), !monoRepoPackages_1_1.done;) {
                        const pkg = monoRepoPackages_1_1.value;
                        if (!opts.quiet) {
                            console.log(chalk `Running {bold autoindex} for the {green ${pkg}}:`);
                        }
                        yield handler(argv, Object.assign(Object.assign({}, opts), { dir: path_1.join(opts.dir || process.env.PWD, "packages", pkg), withinMonorepo: true }));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (monoRepoPackages_1_1 && !monoRepoPackages_1_1.done && (_a = monoRepoPackages_1.return)) yield _a.call(monoRepoPackages_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return;
            }
            else {
                return handler(argv, Object.assign(Object.assign({}, opts), { dir: path_1.join(opts.dir || process.env.PWD, "packages", response), withinMonorepo: true }));
            }
        }
        const srcDir = opts.dir ? path_1.join(process.cwd(), opts.dir) : path_1.join(process.cwd(), "src");
        const paths = yield globby(globInclude || [
            `${srcDir}/**/index.ts`,
            `${srcDir}/**/index.js`,
            `${srcDir}/**/private.ts`,
            `${srcDir}/**/private.js`,
            "!node_modules",
        ]);
        const results = yield index_1.processFiles(paths, opts);
        if (!opts.quiet) {
            console.log();
        }
    });
}
exports.handler = handler;

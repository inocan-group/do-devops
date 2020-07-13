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
const chokidar_1 = require("chokidar");
/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
function handler(argv, opts) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const monoRepoPackages = shared_1.getMonoRepoPackages(process.cwd());
        if (monoRepoPackages && !opts.dir) {
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
        const globInclude = opts.glob ? opts.glob.concat("!node_modules") : false;
        const srcDir = opts.dir ? path_1.join(process.cwd(), opts.dir) : path_1.join(process.cwd(), "src");
        const globPattern = globInclude || [
            `${srcDir}/**/index.ts`,
            `${srcDir}/**/index.js`,
            `${srcDir}/**/private.ts`,
            `${srcDir}/**/private.js`,
        ];
        let watcherReady = false;
        if (opts.watch) {
            const watcher = chokidar_1.watch(srcDir + "/**/*", {
                ignored: /(^|[\/\\])\../,
                persistent: true,
            });
            const log = console.log.bind(console);
            watcher.on("ready", () => {
                log(chalk `- autoindex {italic watcher} has {bold {green started}} monitoring {blue ${srcDir}} for changes`);
                watcherReady = true;
            });
            watcher.on("add", (path) => __awaiter(this, void 0, void 0, function* () {
                // if (watcherReady) {
                //   log(chalk`- file added [ {blue ${path}} ]; re-running autoindex `);
                // }
                const paths = yield globby(globPattern.concat("!node_modules"));
                index_1.processFiles(paths, Object.assign(Object.assign({}, opts), { quiet: true })).catch((e) => log(chalk `Error re-running autoindex (on {italic add} event): ${e.message}\n`, e.stack));
            }));
            watcher.on("unlink", (path) => __awaiter(this, void 0, void 0, function* () {
                const paths = yield globby(globPattern.concat("!node_modules"));
                index_1.processFiles(paths, Object.assign(Object.assign({}, opts), { quiet: true })).catch((e) => log(chalk `Error re-running autoindex (on {italic unlink} event): ${e.message}\n`, e.stack));
            }));
            watcher.on("addDir", (path) => __awaiter(this, void 0, void 0, function* () {
                const paths = yield globby(globPattern.concat("!node_modules"));
                index_1.processFiles(paths, Object.assign(Object.assign({}, opts), { quiet: true })).catch((e) => log(chalk `Error re-running autoindex (on {italic addDir} event): ${e.message}\n`, e.stack));
            }));
            watcher.on("unlinkDir", (path) => __awaiter(this, void 0, void 0, function* () {
                const paths = yield globby(globPattern.concat("!node_modules"));
                index_1.processFiles(paths, Object.assign(Object.assign({}, opts), { quiet: true })).catch((e) => log(chalk `Error re-running autoindex (on {italic unlinkDir} event): ${e.message}\n`, e.stack));
            }));
            watcher.on("error", (e) => {
                log(`- An error occurred while watching autoindex paths: ${e.message}`);
            });
        }
        else {
            const paths = yield globby(globPattern.concat("!node_modules"));
            console.log({ paths });
            const results = yield index_1.processFiles(paths, opts);
            if (!opts.quiet) {
                console.log();
            }
        }
    });
}
exports.handler = handler;

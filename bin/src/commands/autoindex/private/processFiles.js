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
exports.processFiles = void 0;
const index_1 = require("./index");
const fs_1 = require("fs");
const shared_1 = require("../../../shared");
const chalk = require("chalk");
/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
function processFiles(paths, opts) {
    var paths_1, paths_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const results = {};
        try {
            for (paths_1 = __asyncValues(paths); paths_1_1 = yield paths_1.next(), !paths_1_1.done;) {
                const path = paths_1_1.value;
                const fileString = fs_1.readFileSync(path, { encoding: "utf-8" });
                if (fileString.includes("// #autoindex") || fileString.includes("//#autoindex")) {
                    results[path] = fileString;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) yield _a.call(paths_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (Object.keys(results).length === 0) {
            if (opts.withinMonorepo) {
                console.log(chalk `- No {italic autoindex} files found`);
                return;
            }
            else {
                index_1.communicateApi(paths);
            }
        }
        else {
            // iterate over each autoindex file
            for (const filePath of Object.keys(results)) {
                let fileContent = results[filePath];
                const excluded = index_1.exclusions(fileContent);
                const exportableFiles = yield index_1.exportable(filePath, excluded);
                const autoIndexContent = fileContent.includes(":default")
                    ? index_1.defaultExports(exportableFiles)
                    : index_1.namedExports(exportableFiles);
                if (index_1.alreadyHasIndex(fileContent)) {
                    fileContent = index_1.replaceRegion(fileContent, autoIndexContent);
                    const warnings = index_1.unexpectedContent(fileContent);
                    const warningMessage = warnings
                        ? chalk ` {red has unexpected content: {italic {dim ${Object.keys(warnings).join(", ")} }}}`
                        : "";
                    const exclusionMessage = excluded.length > 0 ? chalk ` {dim [ {italic excluding: } {grey ${excluded.join(",")}} ]}` : "";
                    console.log(chalk `- updated index {blue ./${shared_1.relativePath(filePath)}}${exclusionMessage}${warningMessage}`);
                }
                else {
                    fileContent = `${fileContent}\n${index_1.START_REGION}\n${index_1.timestamp()}${autoIndexContent}\n${index_1.END_REGION}`;
                    console.log(chalk `- added index to {blue ./${shared_1.relativePath(filePath)}}`);
                }
                fs_1.writeFileSync(filePath, fileContent);
            }
        }
        console.log();
    });
}
exports.processFiles = processFiles;

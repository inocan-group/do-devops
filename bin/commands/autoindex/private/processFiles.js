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
const shared_1 = require("../../../shared");
const index_1 = require("./index");
const fs_1 = require("fs");
const reference_1 = require("./reference");
const chalk = require("chalk");
const util_1 = require("./util");
/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
function processFiles(paths, opts) {
    var paths_1, paths_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const results = {};
        const defaultExclusions = ["index", "private"];
        const baseExclusions = opts.add
            ? defaultExclusions.concat(opts.add.split(",").map((i) => i.trim()))
            : defaultExclusions;
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
                const excluded = index_1.exclusions(fileContent).concat(baseExclusions);
                const exportableSymbols = yield index_1.exportable(filePath, excluded);
                const exportType = index_1.detectExportType(fileContent);
                let autoIndexContent;
                switch (exportType) {
                    case reference_1.ExportType.default:
                        autoIndexContent = index_1.defaultExports(exportableSymbols, opts);
                        break;
                    case reference_1.ExportType.namedOffset:
                        autoIndexContent = index_1.namedOffsetExports(exportableSymbols, opts);
                        break;
                    case reference_1.ExportType.named:
                        autoIndexContent = index_1.namedExports(exportableSymbols, opts);
                        break;
                    default:
                        throw new shared_1.DevopsError(`Unknown export type: ${exportType}!`, "invalid-export-type");
                }
                /** content that defines the full region owned by autoindex */
                const blockContent = `${index_1.START_REGION}\n\n${index_1.timestamp()}\n${index_1.createMetaInfo(exportType, exportableSymbols, opts)}\n${autoIndexContent}\n\n${index_1.END_REGION}`;
                const existingContentMeta = index_1.getExistingMetaInfo(fileContent);
                let exportAction;
                const bracketedMessages = [];
                if (exportType !== reference_1.ExportType.named) {
                    bracketedMessages.push(chalk `{grey using }{italic ${exportType}} {grey export}`);
                }
                if (autoIndexContent && index_1.alreadyHasAutoindexBlock(fileContent)) {
                    if (index_1.noDifference(existingContentMeta.files, util_1.removeAllExtensions(exportableSymbols.files)) &&
                        index_1.noDifference(existingContentMeta.dirs, util_1.removeAllExtensions(exportableSymbols.dirs)) &&
                        index_1.noDifference(existingContentMeta.sfcs, util_1.removeAllExtensions(exportableSymbols.sfcs))) {
                        exportAction = index_1.ExportAction.noChange;
                    }
                    else {
                        exportAction = index_1.ExportAction.updated;
                    }
                }
                else if (autoIndexContent) {
                    exportAction = index_1.ExportAction.added;
                }
                // BUILD UP CLI MESSAGE
                const warnings = index_1.unexpectedContent(index_1.nonBlockContent(fileContent));
                if (warnings) {
                    bracketedMessages.push(chalk ` {red unexpected content: {italic {dim ${Object.keys(warnings).join(", ")} }}}`);
                }
                const excludedWithoutBase = excluded.filter((i) => !baseExclusions.includes(i));
                if (excludedWithoutBase.length > 0) {
                    bracketedMessages.push(chalk ` {italic excluding: } {grey ${excludedWithoutBase.join(", ")}}`);
                }
                const bracketedMessage = bracketedMessages.length > 0 ? chalk `{dim [ ${bracketedMessages.join(", ")} ]}` : "";
                const changeMessage = chalk `- ${exportAction === index_1.ExportAction.added ? "added" : "updated"} {blue ./${shared_1.relativePath(filePath)}} ${bracketedMessage}`;
                const unchangedMessage = chalk `{dim - {italic no changes} to {blue ./${shared_1.relativePath(filePath)}}} ${bracketedMessage}`;
                if (!opts.quiet && exportAction === index_1.ExportAction.noChange) {
                    console.log(unchangedMessage);
                }
                if (exportAction !== index_1.ExportAction.noChange) {
                    console.log(changeMessage);
                    fs_1.writeFileSync(filePath, existingContentMeta.hasExistingMeta
                        ? index_1.replaceRegion(fileContent, blockContent)
                        : fileContent.concat("\n" + blockContent));
                }
            }
        }
        if (!opts.quiet) {
            console.log();
        }
    });
}
exports.processFiles = processFiles;

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
exports.handler = exports.options = exports.description = void 0;
const chalk = require("chalk");
const globby = require("globby");
const local_1 = require("./local");
const path_1 = require("path");
const fs_1 = require("fs");
const shared_1 = require("../../shared");
const date_fns_1 = require("date-fns");
const START_REGION = "//#region autoindexed files";
const END_REGION = "//#endregion";
function description() {
    return `Automates the building of "index.ts" (and now "private.ts") files for exporting; if you include a comment starting with "// #autoindex into a file it will be auto-indexed. By default it will assume that you are using named exports but if you need default exports then you must state "// #autoindex:default" Finally, if you need to exclude certain files you can explicitly state them after the autoindex declaration with "exclude:a,b,c`;
}
exports.description = description;
exports.options = [
    {
        name: "add",
        type: String,
        group: "autoindex",
        description: `adds additional glob patterns to look for`,
    },
    {
        name: "glob",
        type: String,
        group: "autoindex",
        description: `replaces the glob file matching pattern with your own (however "node_modules" still excluded)`,
    },
    {
        name: "dir",
        type: String,
        group: "autoindex",
        description: `by default will look for files in the "src" directory but you can redirect this to a different directory`,
    },
];
/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
function handler(argv, opts) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const dir = opts.dir || process.env.PWD;
        const globInclude = opts.glob;
        const monoRepoPackages = shared_1.getMonoRepoPackages(dir);
        if (monoRepoPackages) {
            const response = yield local_1.askHowToHandleMonoRepoIndexing(monoRepoPackages);
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
        const srcDir = path_1.join(dir, "src");
        const paths = yield globby([
            `${srcDir}/**/index.ts`,
            `${srcDir}/**/index.js`,
            `${srcDir}/**/private.ts`,
            `${srcDir}/**/private.js`,
            "!node_modules",
        ]);
        const results = yield processFiles(paths, opts);
        if (!opts.quiet) {
            console.log();
        }
    });
}
exports.handler = handler;
function timestamp() {
    return `// indexed at: ${date_fns_1.format(Date.now(), "Mo MMM, yyyy, hh:mm a ( O )")}\n`;
}
/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
function processFiles(paths, opts) {
    var paths_1, paths_1_1;
    var e_2, _a;
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
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) yield _a.call(paths_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (Object.keys(results).length === 0) {
            if (opts.withinMonorepo) {
                console.log(chalk `- No {italic autoindex} files found`);
                return;
            }
            else {
                communicateApi(paths);
            }
        }
        else {
            // iterate over each autoindex file
            for (const filePath of Object.keys(results)) {
                let fileContent = results[filePath];
                const excluded = local_1.exclusions(fileContent);
                const exportableFiles = yield exportable(filePath, excluded);
                const autoIndexContent = fileContent.includes(":default")
                    ? defaultExports(exportableFiles)
                    : namedExports(exportableFiles);
                if (alreadyHasIndex(fileContent)) {
                    fileContent = replaceRegion(fileContent, autoIndexContent);
                    const warnings = unexpectedContent(fileContent);
                    const warningMessage = warnings
                        ? chalk ` {red has unexpected content: {italic {dim ${Object.keys(warnings).join(", ")} }}}`
                        : "";
                    const exclusionMessage = excluded.length > 0 ? chalk ` {dim [ {italic excluding: } {grey ${excluded.join(",")}} ]}` : "";
                    console.log(chalk `- updated index {blue ./${shared_1.relativePath(filePath)}}${exclusionMessage}${warningMessage}`);
                }
                else {
                    fileContent = `${fileContent}\n${START_REGION}\n${timestamp()}${autoIndexContent}\n${END_REGION}`;
                    console.log(chalk `- added index to {blue ./${shared_1.relativePath(filePath)}}`);
                }
                fs_1.writeFileSync(filePath, fileContent);
            }
        }
        console.log();
    });
}
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
/** indicates whether the given file already has a index region defined */
function alreadyHasIndex(fileContent) {
    return fileContent.includes(START_REGION) && fileContent.includes(END_REGION);
}
/** replace an existing region block with a new one */
function replaceRegion(fileContent, regionContent) {
    const re = new RegExp(`${START_REGION}.*${END_REGION}\n`, "gs");
    const replacementContent = `${START_REGION}\n${timestamp()}${regionContent}\n${END_REGION}\n`;
    return fileContent.replace(re, replacementContent);
}
function exportsHaveChanged(fileContent, regionContent) {
    const start = new RegExp(`${START_REGION}\n`, "gs");
    const end = new RegExp(`${END_REGION}\n`, "gs");
    const before = fileContent
        .replace(start, "")
        .replace(end, "")
        .split("\n")
        .filter((i) => i);
    // const after =
}
/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
function namedExports(exportable) {
    const contentLines = [];
    exportable.files.forEach((file) => {
        contentLines.push(`export * from "./${shared_1.exportsAsEsm() ? removeExtension(file) + ".js" : removeExtension(file)}";`);
    });
    exportable.dirs.forEach((dir) => {
        contentLines.push(`export * from "./${dir}/index${shared_1.exportsAsEsm() ? ".js" : ""}";`);
    });
    return contentLines.join("\n");
}
/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
function defaultExports(exportable) {
    const contentLines = [];
    exportable.files.forEach((file) => {
        contentLines.push(`export { default as ${removeExtension(file, true)} } from "./${removeExtension(file)}";`);
    });
    exportable.dirs.forEach((dir) => {
        contentLines.push(`export * from "${dir}/index";`);
    });
    return contentLines.join("\n");
}
/**
 * Looks for content that typically should not be in a index file so
 * it can be communicated to the user
 */
function unexpectedContent(fileContent) {
    const warnings = {};
    if (fileContent.includes("export type") || fileContent.includes("export interface")) {
        warnings["inline interfaces"] = true;
    }
    if (fileContent.includes("import ")) {
        warnings.imports = true;
    }
    if (fileContent.includes("enum ")) {
        warnings.enums = true;
    }
    if (fileContent.includes("function ")) {
        warnings.functions = true;
    }
    return Object.keys(warnings).length > 0 ? warnings : false;
}
function removeExtension(file, force = false) {
    const parts = file.split(".");
    const [fn, ext] = parts.length > 2 ? [file.replace("." + parts[parts.length - 1], ""), parts[parts.length - 1]] : file.split(".");
    return ext === "vue" && !force ? file : fn;
}
function communicateApi(paths) {
    console.log(`- Scanned through ${chalk.bold(String(paths.length))} ${chalk.italic("index")} files but none of them were "autoindex" files.\n`);
    console.log(`${chalk.bold("  Note: ")}${chalk.dim.italic('to make an "index.ts" or "index.js" file an "autoindex file"')}`);
    console.log(chalk.dim.italic("  you must add in the following to your index file (ideally on the first line):\n"));
    console.log("  " + chalk.whiteBright.bgBlue("//#autoindex:[CMD] \n"));
    console.log(chalk.dim.italic("  where the valid commands are (aka, CMD from above): ") + chalk.italic("named,defaults"));
    console.log(chalk `  {white {bold Note:}}\n    {dim {italic you can also add the "--add" flag to look for other regex files patterns}}`);
}

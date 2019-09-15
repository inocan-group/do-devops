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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = __importDefault(require("globby"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
function description() {
    return `automates the building of "index.ts" files for exporting`;
}
exports.description = description;
/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
function handler() {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = yield globby_1.default(["**/index.ts", "**/index.js", "!node_modules"]);
        const filesToComplete = yield findAutoCompleteFiles(paths);
    });
}
exports.handler = handler;
function findAutoCompleteFiles(paths) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = [];
        for (const path of paths) {
            const fileString = fs_1.default.readFileSync(path, { encoding: "utf-8" });
            if (fileString.includes("// #autoindex:")) {
                result.push(path);
            }
        }
        if (result.length === 0) {
            console.log(`- Scanned through ${chalk_1.default.bold(String(paths.length))} ${chalk_1.default.italic("index")} files but none of them were "autoindex" files.\n`);
            console.log(`${chalk_1.default.bold("  Note: ")}${chalk_1.default.dim.italic('to make an "index.ts" or "index.js" file an "autoindex file"')}`);
            console.log(chalk_1.default.dim.italic("  you must add in the following to your index file (ideally on the first line):\n"));
            console.log("  " + chalk_1.default.whiteBright.bgBlue("//#autoindex:[CMD] \n"));
            console.log(chalk_1.default.dim.italic("  where the valid commands are (aka, CMD from above): ") + chalk_1.default.italic("named,defaults"));
        }
        console.log();
    });
}

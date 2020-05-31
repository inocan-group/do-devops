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
const chalk = require("chalk");
const path = require("path");
/**
 * Returns an array of _exports_ that a given file provides
 *
 * @param file the filename and relative path of the file being analyized
 * @param filter you can optionally provide a filter which will be run over
 * the exports so you can isolate the exports only to those you are interested in
 */
function getExportsFromFile(file, filter = () => true) {
    return __awaiter(this, void 0, void 0, function* () {
        const srcDir = path.join(process.env.PWD, "src");
        const exports = yield Promise.resolve().then(() => require(path.join("..", file.replace(srcDir, "").replace(".ts", ""))));
        return Object.keys(exports).reduce((agg, key) => {
            const value = exports[key];
            if (filter(value)) {
                agg[key] = {
                    symbol: key,
                    type: typeof value,
                    props: typeof value === "object" ? Object.keys(value) : undefined,
                };
            }
            else {
                console.log(chalk.grey(`- ignoring the export "${key}" due to the filter condition`));
            }
            return agg;
        }, {});
    });
}
exports.getExportsFromFile = getExportsFromFile;

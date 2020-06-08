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
exports.useKey = exports.createWebpackEntryDictionaries = void 0;
const path = require("path");
const write_1 = require("../../file/write");
/**
 * Webpack can create named multiple entry points if the `entry` parameter
 * is passed a dictionary where the key is the module name (in Serverless
 * this would be the handler's name) and the value is then the full path to
 * the file.
 *
 * This function will, given a path to the source typescript files, produce
 * two dictionaries:
 *
 * 1. `webpack.ts-entry-points.json` - a dictionary that points to the handler's
 * typescript source
 * 2. `webpack.js-entry-points.json` - a dictionary that points to webpack's outputted
 * javascript files
 *
 * If you are using the `serverless-webpack` plugin you should use the former, if you
 * are managing the webpack process yourself then the latter is likely more appropriate.
 */
function createWebpackEntryDictionaries(handlerFns) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = handlerFns.reduce((agg, f) => {
            const fn = f
                .split("/")
                .pop()
                .replace(".ts", "");
            const tsPath = "./" + path.relative(process.cwd(), f);
            const jsPath = tsPath
                .split("/")
                .pop()
                .replace(/(.*)/, ".webpack/$1")
                .replace(".ts", ".js");
            return agg.concat({ fn, tsPath, jsPath });
        }, []);
        yield Promise.all([
            write_1.write("webpack.ts-entry-points.json", data.reduce(useKey("tsPath"), {})),
            write_1.write("webpack.js-entry-points.json", data.reduce(useKey("jsPath"), {}))
        ]);
    });
}
exports.createWebpackEntryDictionaries = createWebpackEntryDictionaries;
function useKey(key) {
    return (agg, curr) => {
        agg[curr.fn] = curr[key];
        return agg;
    };
}
exports.useKey = useKey;

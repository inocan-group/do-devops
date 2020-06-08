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
const wp = require("webpack");
const index_1 = require("../../../shared/ast/index");
const path_1 = require("path");
/**
 * Transpiles all or _some_ of the handler functions
 * using **Webpack**
 */
function webpack(opts = {}) {
    const fns = opts.fns || index_1.getValidServerlessHandlers();
    delete opts.fns;
    return {
        build: build(fns, opts),
        watch: watch(fns, opts),
    };
}
exports.default = webpack;
function build(fns, opts) {
    return function webpackBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("webpack build:", fns);
        });
    };
}
function watch(fns, opts) {
    return function webpackWatch() {
        return __awaiter(this, void 0, void 0, function* () {
            const wpConfig = yield Promise.resolve().then(() => require(path_1.join(process.cwd(), "webpack.config.js")));
            wp(wpConfig).watch({}, function () {
                console.log("watcher");
            });
        });
    };
}

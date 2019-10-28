"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../shared/ast/index");
/**
 * Transpiles all or _some_ of the handler functions
 * using **Webpack**
 */
function webpack(opts = {}) {
    const fns = opts.fns || index_1.getValidServerlessHandlers();
    delete opts.fns;
    return {
        build: build(fns, opts),
        watch: watch(fns, opts)
    };
}
exports.default = webpack;
function build(fns, opts) {
    return function webpackBuild() {
        console.log("webpack build:", fns);
    };
}
function watch(fns, opts) {
    return function webpackWatch() {
        //
    };
}

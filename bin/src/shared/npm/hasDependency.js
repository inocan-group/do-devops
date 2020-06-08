"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDependency = void 0;
const index_1 = require("./index");
let _deps;
function hasDependency(dep, pathOveride) {
    const deps = _deps ? _deps : (index_1.getPackageJson(pathOveride) || {}).dependencies;
    _deps = deps;
    return _deps && Object.keys(deps).includes(dep);
}
exports.hasDependency = hasDependency;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDevDependency = void 0;
const index_1 = require("./index");
let _devDeps;
function hasDevDependency(dep, pathOveride) {
    const devDeps = _devDeps ? _devDeps : (index_1.getPackageJson(pathOveride) || {}).devDependencies;
    _devDeps = devDeps;
    return _devDeps && Object.keys(devDeps).includes(dep);
}
exports.hasDevDependency = hasDevDependency;

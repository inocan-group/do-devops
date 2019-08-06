"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function getPackageJson(pathOveride) {
    const rootPath = pathOveride || process.env.PWD;
    const packageJson = JSON.parse(fs_1.readFileSync(path_1.default.join(rootPath, "/package.json"), {
        encoding: "utf-8"
    }));
    return packageJson;
}
exports.getPackageJson = getPackageJson;
let _devDeps;
function hasDevDependency(dep, pathOveride) {
    const devDeps = _devDeps
        ? _devDeps
        : getPackageJson(pathOveride).devDependencies;
    _devDeps = devDeps;
    return Object.keys(devDeps).includes(dep);
}
exports.hasDevDependency = hasDevDependency;

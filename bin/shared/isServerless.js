"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getPackageJson_1 = require("./getPackageJson");
/**
 * returns a set of flags indicating whether it appears the serverless framework
 * is being used in this repo
 */
function isServerless() {
    const hasServerlessConfig = fs_1.default.existsSync(path_1.default.join(process.env.CWD, "serverless.yml"));
    const pkgJson = getPackageJson_1.getPackageJson();
    const hasAsDevDep = pkgJson
        ? Object.keys(pkgJson.devDependencies).includes("serverless")
        : false;
    const isUsingTypescriptMicroserviceTemplate = fs_1.default.existsSync(path_1.default.join(process.env.CWD, "serverless-config/config.ts"));
    return hasServerlessConfig || hasAsDevDep || isUsingTypescriptMicroserviceTemplate
        ? {
            hasServerlessConfig,
            hasAsDevDep,
            isUsingTypescriptMicroserviceTemplate
        }
        : false;
}
exports.isServerless = isServerless;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * returns `package.json` of the local repo as a typed object
 */
function getPackageJson() {
    const filename = path_1.default.join(process.env.CWD, "package.json");
    const hasServerlessConfig = fs_1.default.existsSync(filename);
    if (hasServerlessConfig) {
        const file = JSON.parse(fs_1.default.readFileSync(filename, { encoding: "utf-8" }));
        return file;
    }
    else {
        return false;
    }
}
exports.getPackageJson = getPackageJson;

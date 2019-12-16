"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const recast = __importStar(require("recast"));
const fs_1 = require("fs");
function parseFile(filename) {
    const fileContents = fs_1.readFileSync(filename, {
        encoding: "utf-8"
    });
    return recast.parse(fileContents, {
        parser: require("recast/parsers/typescript")
    });
}
exports.parseFile = parseFile;

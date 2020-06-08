"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportsHaveChanged = void 0;
const index_1 = require("../index");
function exportsHaveChanged(fileContent, regionContent) {
    const start = new RegExp(`${index_1.START_REGION}\n`, "gs");
    const end = new RegExp(`${index_1.END_REGION}\n`, "gs");
    const before = fileContent
        .replace(start, "")
        .replace(end, "")
        .split("\n")
        .filter((i) => i);
    // const after =
}
exports.exportsHaveChanged = exportsHaveChanged;

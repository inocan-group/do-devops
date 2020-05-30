"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function exportsAsEsm() {
    return index_1.getPackageJson().type === "module";
}
exports.exportsAsEsm = exportsAsEsm;

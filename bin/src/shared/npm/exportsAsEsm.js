"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportsAsEsm = void 0;
const index_1 = require("./index");
function exportsAsEsm() {
    return index_1.getPackageJson().type === "module";
}
exports.exportsAsEsm = exportsAsEsm;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectExportType = void 0;
const index_1 = require("../index");
function detectExportType(fileContent) {
    const defaultExport = /autoindex:default/;
    const namedOffsetExport = /autoindex:named\-offset/;
    if (defaultExport.test(fileContent)) {
        return index_1.ExportType.default;
    }
    if (namedOffsetExport.test(fileContent)) {
        return index_1.ExportType.namedOffset;
    }
    return index_1.ExportType.named;
}
exports.detectExportType = detectExportType;

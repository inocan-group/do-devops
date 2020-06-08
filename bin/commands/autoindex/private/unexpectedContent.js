"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unexpectedContent = void 0;
/**
 * Looks for content that typically should not be in a index file so
 * it can be communicated to the user
 */
function unexpectedContent(fileContent) {
    const warnings = {};
    if (fileContent.includes("export type") || fileContent.includes("export interface")) {
        warnings["inline interfaces"] = true;
    }
    if (fileContent.includes("import ")) {
        warnings.imports = true;
    }
    if (fileContent.includes("enum ")) {
        warnings.enums = true;
    }
    if (fileContent.includes("function ")) {
        warnings.functions = true;
    }
    return Object.keys(warnings).length > 0 ? warnings : false;
}
exports.unexpectedContent = unexpectedContent;

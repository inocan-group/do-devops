"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.structurePriorAutoindexContent = void 0;
const index_1 = require("../index");
const reference_1 = require("../reference");
function structurePriorAutoindexContent(content) {
    // const timestamp = ``
    const re = new RegExp(`(${index_1.START_REGION}.*([^\0]*).*${index_1.END_REGION})`, "g");
    const contentBlock = content.replace(re, "$2");
    const lines = contentBlock.split("\n");
    const exportLines = lines.filter((i) => i.slice(0, 6) === "export");
    const symbols = exportLines.map((i) => i.replace(/(.*"\.\/(.\w*).*)/, "$2"));
    const exportType = exportLines.length === 0 ? "unknown" : getType(exportLines);
    const timestamp = lines
        .filter((i) => i.includes("// indexed at:"))
        .map((i) => i.replace(/(.*indexed at:\s*)(.*)$/, "$2"));
    return { exportType, symbols, quantity: symbols.length, timestamp };
}
exports.structurePriorAutoindexContent = structurePriorAutoindexContent;
function getType(exportLines) {
    return exportLines[0].includes("* as ")
        ? reference_1.ExportType.namedOffset
        : exportLines[0].includes("{ default as ")
            ? reference_1.ExportType.default
            : reference_1.ExportType.named;
}

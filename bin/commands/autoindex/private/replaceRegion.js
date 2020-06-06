"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceRegion = void 0;
const index_1 = require("./index");
/** replace an existing region block with a new one */
function replaceRegion(fileContent, regionContent) {
    const re = new RegExp(`${index_1.START_REGION}.*${index_1.END_REGION}\n`, "gs");
    const replacementContent = `${index_1.START_REGION}\n${index_1.timestamp()}${regionContent}\n${index_1.END_REGION}\n`;
    return fileContent.replace(re, replacementContent);
}
exports.replaceRegion = replaceRegion;

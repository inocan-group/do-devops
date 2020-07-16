"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceRegion = void 0;
const index_1 = require("../index");
/** replace an existing region block with a new one */
function replaceRegion(fileContent, regionContent) {
    // const replacementContent = `${START_REGION}\n${timestamp()}${regionContent}\n${END_REGION}\n`;
    const re = new RegExp(`${index_1.START_REGION}.*${index_1.END_REGION}`, "gs");
    return fileContent.replace(re, regionContent);
}
exports.replaceRegion = replaceRegion;

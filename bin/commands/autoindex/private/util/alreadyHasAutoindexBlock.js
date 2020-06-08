"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alreadyHasAutoindexBlock = void 0;
const index_1 = require("../index");
/** indicates whether the given file already has a index region defined */
function alreadyHasAutoindexBlock(fileContent) {
    return fileContent.includes(index_1.START_REGION) && fileContent.includes(index_1.END_REGION);
}
exports.alreadyHasAutoindexBlock = alreadyHasAutoindexBlock;

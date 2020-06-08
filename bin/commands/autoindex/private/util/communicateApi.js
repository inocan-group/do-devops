"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communicateApi = void 0;
const chalk = require("chalk");
function communicateApi(paths) {
    console.log(`- Scanned through ${chalk.bold(String(paths.length))} ${chalk.italic("index")} files but none of them were "autoindex" files.\n`);
    console.log(`${chalk.bold("  Note: ")}${chalk.dim.italic('to make an "index.ts" or "index.js" file an "autoindex file"')}`);
    console.log(chalk.dim.italic("  you must add in the following to your index file (ideally on the first line):\n"));
    console.log("  " + chalk.whiteBright.bgBlue("//#autoindex:[CMD] \n"));
    console.log(chalk.dim.italic("  where the valid commands are (aka, CMD from above): ") + chalk.italic("named,defaults"));
    console.log(chalk `  {white {bold Note:}}\n    {dim {italic you can also add the "--add" flag to look for other regex files patterns}}`);
}
exports.communicateApi = communicateApi;
//#region autoindexed files
// indexed at: 6th Jun, 2020, 01:03 AM ( GMT-7 )
// local file exports
__exportStar(require("./alreadyHasAutoindexBlock"), exports);
__exportStar(require("./askHowToHandleMonoRepoIndexing"), exports);
__exportStar(require("./communicateApi"), exports);
__exportStar(require("./detectExportType"), exports);
__exportStar(require("./exportsHaveChanged"), exports);
__exportStar(require("./index"), exports);
__exportStar(require("./removeExtension"), exports);
__exportStar(require("./replaceRegion"), exports);
__exportStar(require("./structurePriorAutoindexContent"), exports);
__exportStar(require("./timestamp"), exports);
__exportStar(require("./unexpectedContent"), exports);
//#endregion

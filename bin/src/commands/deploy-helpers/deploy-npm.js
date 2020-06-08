"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
/**
 * Manages the execution of a NPM deployment
 * (aka, a "publish" event)
 */
function npmDeploy() {
    console.log(chalk `- {bold npm} build starting ${"\uD83C\uDF89" /* party */}`);
}
exports.default = npmDeploy;

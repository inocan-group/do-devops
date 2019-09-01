"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
/**
 * Manages the execution of a NPM deployment
 * (aka, a "publish" event)
 */
function npmDeploy() {
    console.log(chalk_1.default `- {bold npm} build starting ${"\uD83C\uDF89" /* party */}`);
}
exports.default = npmDeploy;

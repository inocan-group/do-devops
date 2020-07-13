"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const chalk = require("chalk");
const async_shelljs_1 = require("async-shelljs");
function handler(action, currentBranch, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk `- ${"\uD83D\uDC40" /* eyeballs */} ensuring Typescript compiler reports no errors in transpilation`);
        const result = async_shelljs_1.exec(`yarn tsc`, { silent: options.quiet });
        if (result.code === 0) {
            console.log(chalk `- ${"\uD83C\uDF89" /* party */} transpilation found no issues!`);
        }
        if (options.quiet && result.code !== 0) {
            console.log(chalk `- ${"\uD83D\uDCA9" /* poop */} transpilation failed!`);
        }
        // return real result code if error; otherwise just report a normal exit
        return action === "error" ? result.code : 0;
    });
}
exports.handler = handler;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const inquirer = require("inquirer");
function deployBoth() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default `- This repo appears to be {italic both} a {bold Serverless} and an {bold NPM} project.`);
        console.log(chalk_1.default `- In the future you can use the {blue --target [ {dim serverless,npm} ]} switch to be explicit.`);
        console.log();
        const question = {
            type: "list",
            name: "type",
            message: chalk_1.default `Choose the {italic type} of build you want:`,
            choices: ["serverless", "npm"],
            default: "serverless"
        };
        const answer = yield inquirer.prompt(question);
        return answer.type;
    });
}
exports.default = deployBoth;

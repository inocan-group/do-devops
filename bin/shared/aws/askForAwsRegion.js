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
const inquirer = require("inquirer");
/**
 * Asks the user to choose an AWS region
 */
function askForAwsRegion() {
    return __awaiter(this, void 0, void 0, function* () {
        const question = {
            type: "list",
            name: "region",
            message: "What AWS region do you want to target?",
            default: "us-east-1",
            choices: [
                "us-east-1",
                "us-east-2",
                "us-west-1",
                "us-west-2",
                "eu-west-1",
                "eu-west-2",
                "eu-west-3",
                "eu-north-1",
                "eu-central-1",
                "sa-east-1",
                "ca-central-1",
                "ap-south-1",
                "ap-northeast-1",
                "ap-northeast-2",
                "ap-northeast-3",
                "ap-southeast-1",
                "ap-southeast-2"
            ]
        };
        const answer = yield inquirer.prompt(question);
        return answer.region;
    });
}
exports.askForAwsRegion = askForAwsRegion;

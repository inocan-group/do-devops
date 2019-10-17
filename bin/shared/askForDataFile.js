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
const index_1 = require("./index");
/**
 * Asks the user to choose an AWS region
 */
function askForDataFile(listOfFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = listOfFiles ? listOfFiles : yield index_1.getDataFiles();
        const question = {
            type: "list",
            name: "file",
            message: "What data file would you like?",
            default: files[0],
            choices: files
        };
        const answer = yield inquirer.prompt(question);
        return answer.file;
    });
}
exports.askForDataFile = askForDataFile;

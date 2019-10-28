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
const getLocalServerlessFunctionsFromServerlessYaml_1 = require("./getLocalServerlessFunctionsFromServerlessYaml");
/**
 * Asks the user to choose one or more handler functions
 */
function askForFunctions(message = "Which functions do you want to use?", defaults = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const fns = Object.keys(yield getLocalServerlessFunctionsFromServerlessYaml_1.getLocalServerlessFunctionsFromServerlessYaml());
        const question = {
            type: "checkbox",
            message,
            name: "fns",
            choices: fns,
            default: defaults
        };
        const answer = yield inquirer.prompt(question);
        return answer.fns;
    });
}
exports.askForFunctions = askForFunctions;
/**
 * Asks the user to choose one or more handler functions
 */
function askForFunction(message = "Which function do you want to use?") {
    return __awaiter(this, void 0, void 0, function* () {
        const fns = Object.keys(yield getLocalServerlessFunctionsFromServerlessYaml_1.getLocalServerlessFunctionsFromServerlessYaml());
        const question = {
            type: "list",
            message,
            name: "fn",
            choices: fns
        };
        const answer = yield inquirer.prompt(question);
        return answer.fn;
    });
}
exports.askForFunction = askForFunction;

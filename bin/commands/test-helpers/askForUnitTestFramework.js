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
exports.askForUnitTestFramework = void 0;
const inquirer = require("inquirer");
const shared_1 = require("../../shared");
/**
 * Asks the user to choose an AWS profile
 */
function askForUnitTestFramework() {
    return __awaiter(this, void 0, void 0, function* () {
        const devDeps = Object.keys(shared_1.getPackageJson().devDependencies);
        const testFrameworks = ["mocha", "jest", "other"];
        const defaultFramework = devDeps.includes("mocha") ? "mocha" : devDeps.includes("jest") ? "jest" : "other";
        const framework = {
            name: "unitTestFramework",
            type: "list",
            choices: testFrameworks,
            message: "choose the unit testing framework you are using",
            default: defaultFramework,
            when: () => true,
        };
        const testLocations = ["test", "tests", "other"];
        const testLocation = {
            name: "testDirectory",
            type: "list",
            choices: testLocations,
            message: "choose the unit testing framework you are using",
            default: "test",
            when: () => true,
        };
        const testPatterns = [
            "**/*-spec.ts",
            "**/*.spec.ts",
            "**/*-test.ts",
            "**/*.test.ts",
            "**/*-spec.js",
            "**/*.spec.js",
            "**/*-test.js",
            "**/*.test.js",
        ];
        const testPattern = {
            name: "testPattern",
            type: "list",
            choices: testPatterns,
            message: "what pattern should identify a test file versus just a normal file",
            default: "**/*-spec.ts",
            when: () => true,
        };
        let answer = yield inquirer.prompt([framework, testLocation, testPattern]);
        if (answer.testLocation === "other") {
            const freeformLocation = {
                name: "testDirectory",
                type: "input",
                message: "What is the path to your tests?",
            };
            answer = Object.assign(Object.assign({}, answer), (yield inquirer.prompt(freeformLocation)));
        }
        return answer;
    });
}
exports.askForUnitTestFramework = askForUnitTestFramework;

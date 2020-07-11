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
const chalk = require("chalk");
const globby = require("globby");
const askForSpecificTests_1 = require("./askForSpecificTests");
const shared_1 = require("../../shared");
const async_shelljs_1 = require("async-shelljs");
const common_types_1 = require("common-types");
const testName_1 = require("./testName");
/** runs the Mocha command to execute the tests */
const tsExecution = (fns) => __awaiter(void 0, void 0, void 0, function* () {
    /** the tsconfig-paths npm package can provide convenient path alias which work with ts-node */
    const hasTsconfigPaths = shared_1.hasDevDependency("tsconfig-paths");
    const mochaRequires = hasTsconfigPaths ? ["ts-node/register", "tsconfig-paths/register"] : ["ts-node/register"];
    const command = `yarn mocha --no-timeouts ${mochaRequires.map((i) => `-r ${i}`).join(" ")} --exit ${fns.join(" ")}`;
    if (hasTsconfigPaths) {
        console.log(chalk `- using {blue tsconfig-paths} with mocha to support path aliases. {grey remove the npm package to have this behavior stop}\n`);
    }
    return async_shelljs_1.asyncExec(`yarn mocha --no-timeouts ${mochaRequires.map((i) => `-r ${i}`).join(" ")} --exit ${fns.join(" ")}`);
});
const mocha = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield shared_1.getConfig();
    const allTests = yield globby([common_types_1.pathJoin(config.test.testDirectory, config.test.testPattern)]);
    let selectedTests = [];
    if (args.length > 0) {
        args.forEach((searchTerm) => {
            const found = allTests.filter((t) => t.includes(searchTerm));
            if (found.length === 0) {
                console.log(chalk `- the {italic.blue ${searchTerm}} search term found no matches in the available tests`);
            }
            else {
                selectedTests = selectedTests.concat(...found);
            }
        });
        if (selectedTests.length === 0) {
            const selectedTests = yield askForSpecificTests_1.askForSpecificTests(askForSpecificTests_1.SpecificTestReason.noResultsFound, allTests);
        }
        if (selectedTests.length === 0) {
            console.log(chalk `- no tests matched; valid tests include:\n`);
            console.log(chalk `{dim ${allTests.map((t) => testName_1.testName(t, config.test.testPattern).padEnd(20)).join("\t")}}`);
        }
        else {
            console.log(chalk `- ${"\uD83C\uDFC3" /* run */} running {bold ${String(selectedTests.length)}} ({italic of} {bold ${String(allTests.length)}}) mocha tests: {grey ${selectedTests.map((t) => testName_1.testName(t, config.test.testPattern)).join(", ")}}`);
        }
    }
    else {
        selectedTests = allTests;
        if (selectedTests.length === 0) {
            console.log(chalk `- There were {red.bold NO} mocha unit tests in the "${config.test.testDirectory}" directory [ pattern: {grey.italic ${config.test.testPattern}} ]\n`);
            process.exit();
        }
        else {
            console.log(chalk `- ${"\uD83C\uDFC3" /* run */} running {italic all} {bold ${String(selectedTests.length)}} mocha tests: {grey ${selectedTests.map((t) => testName_1.testName(t, config.test.testPattern)).join(", ")}}`);
        }
    }
    console.log();
    yield tsExecution(selectedTests).catch((e) => {
        console.log(chalk `\n- ${"\uD83D\uDE21" /* angry */}  tests completed but {red errors} were encountered`);
        process.exit(1);
    });
    console.log(chalk `- ${"\uD83C\uDF89" /* party */}  all tests completed successfully\n`);
    process.exit();
});
exports.default = mocha;

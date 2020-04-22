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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const askForUnitTestFramework_1 = require("./test-helpers/askForUnitTestFramework");
function description() {
    return `Test some or all of your tests and incorporate useful test data without effort.`;
}
exports.description = description;
function examples() {
    return [
        'Typing "do test" by itself will search in the testing directory for all test files and run them all',
        'Typing "do test foo bar baz" will look for all test files which contain foo, bar, or baz in their name and execute them'
    ];
}
exports.examples = examples;
function handler(args, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        let test;
        try {
            const config = yield shared_1.getConfig();
            if (!config.test || !config.test.unitTestFramework) {
                const unitTestFramework = yield askForUnitTestFramework_1.askForUnitTestFramework();
                yield shared_1.writeSection("test", Object.assign(Object.assign({}, config.test), unitTestFramework), "project");
            }
            if ((config === null || config === void 0 ? void 0 : config.test.unitTestFramework) === "mocha") {
                test = (yield Promise.resolve().then(() => __importStar(require("./test-helpers/mocha")))).default;
            }
            else if ((config === null || config === void 0 ? void 0 : config.test.unitTestFramework) === "jest") {
                test = (yield Promise.resolve().then(() => __importStar(require("./test-helpers/jest")))).default;
            }
            else {
                test = (yield Promise.resolve().then(() => __importStar(require("./test-helpers/other")))).default;
            }
            yield test(args);
        }
        catch (e) {
            console.log(`- Error finding functions: ${e.message}\n`);
            process.exit();
        }
    });
}
exports.handler = handler;

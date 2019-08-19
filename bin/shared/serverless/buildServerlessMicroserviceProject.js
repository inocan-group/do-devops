"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getMicroserviceConfig_1 = require("./getMicroserviceConfig");
const _1 = require(".");
const chalk_1 = __importDefault(require("chalk"));
/**
 * Builds a `serverless.yml` file from the configuration
 * available in the `/serverless-config` directory.
 *
 * The key requirement here is that the `accountInfo` hash is
 * built out. This information will be gathered from the
 * following sources (in this order):
 *
 * 1. look within the `serverless.yml` for info (if it exists)
 * 2. ask the user for the information (saving values as default for next time)
 */
function buildServerlessMicroserviceProject() {
    return __awaiter(this, void 0, void 0, function* () {
        const accountInfo = (yield _1.getAccountInfoFromServerlessYaml()) || (yield _1.askForAccountInfo());
        console.log(chalk_1.default `- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} {bold ]} has been gathered; ready to build {green serverless.yml}`);
        const config = (yield getMicroserviceConfig_1.getMicroserviceConfig(accountInfo)).replace(/^.*\}\'(.*)/, "$1");
        try {
            const configComplete = JSON.parse(config);
            yield _1.saveToServerlessYaml(configComplete);
            console.log(chalk_1.default `- The {green {bold serverless.yml}} file has been updated! ${"\uD83D\uDE80" /* rocket */}`);
            return configComplete;
        }
        catch (e) {
            console.log(chalk_1.default `- {red the attempt to parse the serverless config has failed!} ${"\uD83D\uDCA9" /* poop */}`);
            console.log(e.message);
            console.log(chalk_1.default `{dim ${e.stack}}`);
            console.log();
            process.exit();
        }
    });
}
exports.buildServerlessMicroserviceProject = buildServerlessMicroserviceProject;

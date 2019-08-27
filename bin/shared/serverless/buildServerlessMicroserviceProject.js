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
const ui_1 = require("../ui");
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
        let stage = "starting";
        const accountInfo = (yield _1.getAccountInfoFromServerlessYaml()) || (yield _1.askForAccountInfo());
        console.log(chalk_1.default `- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered; ready to build {green serverless.yml}`);
        try {
            const config = (yield getMicroserviceConfig_1.getMicroserviceConfig(accountInfo)).replace(/^.*\}\'(.*)/, "$1");
            stage = "config-returned";
            let configComplete;
            try {
                configComplete = JSON.parse(config);
            }
            catch (e) {
                console.log(chalk_1.default `- {yellow Warning:} parsing the configuration caused an error ${"\uD83D\uDE32" /* shocked */}`);
                console.log(chalk_1.default `{dim - will make second attempt with more aggressive regex}`);
                try {
                    const strippedOut = config.replace(/(.*)\{"service.*/, "$1");
                    const newAttempt = config.replace(/.*(\{"service.*)/, "$1");
                    configComplete = JSON.parse(newAttempt);
                    console.log(chalk_1.default `- by removing some of the text at the beginning we {bold were} able to parse the config ${"\uD83D\uDC4D" /* thumbsUp */}`);
                    console.log(chalk_1.default `- the text removed was:\n{dim ${strippedOut}}`);
                }
                catch (e) {
                    console.log(chalk_1.default `{red - Failed {italic again} to parse the configuration file!}`);
                    console.log(`- Error message was: ${e.message}`);
                    console.log(chalk_1.default `- The config that is being parsed is:\n\n${config}\n`);
                    process.exit();
                }
            }
            stage = "config-parsed";
            yield _1.saveFunctionsTypeDefinition(configComplete);
            console.log(chalk_1.default `- The function enumeration at {bold src/@types/build.ts} has been updated`);
            stage = "type-definitions-written";
            const fns = Object.keys(configComplete.functions);
            const plugins = configComplete.plugins || [];
            console.log(chalk_1.default `- The serverless config consists of:\n  - {yellow ${String(fns.length)}} functions [ {dim ${ui_1.truncate(fns, 5)}} ]\n  - {yellow ${String(configComplete.stepFunctions
                ? configComplete.stepFunctions.stateMachines.length
                : 0)}} step functions\n  - {yellow ${String(plugins.length)}} plugins [ {dim ${ui_1.truncate(plugins, 5)}} ]`);
            if (configComplete.layers) {
                const layers = Object.keys(configComplete.layers);
                console.log(chalk_1.default `  - {yellow ${String(layers.length)}} layers [ {dim ${ui_1.truncate(layers, 5)}} ]`);
            }
            configComplete = yield _1.askAboutLogForwarding(configComplete);
            yield _1.saveToServerlessYaml(configComplete);
            console.log(chalk_1.default `- The {green {bold serverless.yml}} file has been updated! ${"\uD83D\uDE80" /* rocket */}\n`);
            return configComplete;
        }
        catch (e) {
            console.log(chalk_1.default `- {red the attempt to parse the serverless config has failed at stage "${stage}"!} ${"\uD83D\uDCA9" /* poop */}`);
            console.log(`- The config sent in was:\n${JSON.stringify(accountInfo, null, 2)}`);
            console.log("- " + e.message);
            console.log(chalk_1.default `{dim ${e.stack}}`);
            console.log();
            process.exit();
        }
    });
}
exports.buildServerlessMicroserviceProject = buildServerlessMicroserviceProject;

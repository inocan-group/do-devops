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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const index_1 = require("../../ast/index");
const fs_1 = require("fs");
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
        const accountInfo = (yield __1.getAccountInfoFromServerlessYaml()) || (yield __1.askForAccountInfo());
        console.log(chalk_1.default `- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered; ready to build {green serverless.yml}`);
        // try {
        //   // const config = (await getMicroserviceConfig(accountInfo)).replace(
        //   //   /^.*\}\'(.*)/,
        //   //   "$1"
        //   // );
        //   stage = "config-returned";
        //   let configComplete: IServerlessConfig;
        //   try {
        console.log(index_1.getValidServerlessHandlers());
        const configFile = path_1.default.join(process.env.PWD, "/serverless-config/config.ts");
        console.log(configFile);
        const exists = fs_1.existsSync(configFile);
        console.log("exists", exists);
        const config = (yield Promise.resolve().then(() => __importStar(require(configFile)))).default;
        console.log(config);
        // const ast = parseFile(
        //   "/Volumes/Coding/universal/transport-services/serverless-config/config.ts"
        // );
        //     console.log("made it");
        //     // const config = (await import(configFile)).default(accountInfo);
        //     process.exit();
        //   } catch (e1) {
        //     console.log(
        //       chalk`- {yellow Warning:} parsing the configuration caused an error ${emoji.shocked}`
        //     );
        //     console.log(
        //       chalk`{dim - will make second attempt with more aggressive regex}`
        //     );
        //     const strippedOut = config.replace(/(.*)\{"service.*/, "$1");
        //     const newAttempt = config
        //       .replace(/\n/g, "")
        //       .replace(/.*(\{"service.*)/, "$1");
        //     try {
        //       configComplete = JSON.parse(newAttempt);
        //       console.log(
        //         chalk`- by removing some of the text at the beginning we {bold were} able to parse the config ${emoji.thumbsUp}`
        //       );
        //       console.log(chalk`- the text removed was:\n{dim ${strippedOut}}`);
        //     } catch (e) {
        //       console.log(
        //         chalk`{red - Failed {italic again} to parse the configuration file!}`
        //       );
        //       console.log(`- Error message was: ${e.message}`);
        //       console.log(
        //         chalk`- The config that is being parsed is:\n\n${newAttempt}\n`
        //       );
        //       process.exit();
        //     }
        //   }
        //   stage = "config-parsed";
        //   await saveFunctionsTypeDefinition(configComplete);
        //   console.log(
        //     chalk`- The function enumeration at {bold src/@types/build.ts} has been updated`
        //   );
        //   stage = "type-definitions-written";
        //   const fns = Object.keys(configComplete.functions);
        //   const plugins = configComplete.plugins || [];
        //   console.log(
        //     chalk`- The serverless config consists of:\n  - {yellow ${String(
        //       fns.length
        //     )}} functions [ {dim ${truncate(fns, 5)}} ]\n  - {yellow ${String(
        //       configComplete.stepFunctions
        //         ? configComplete.stepFunctions.stateMachines.length
        //         : 0
        //     )}} step functions\n  - {yellow ${String(
        //       plugins.length
        //     )}} plugins [ {dim ${truncate(plugins, 5)}} ]`
        //   );
        //   if (configComplete.layers) {
        //     const layers = Object.keys(configComplete.layers);
        //     console.log(
        //       chalk`  - {yellow ${String(layers.length)}} layers [ {dim ${truncate(
        //         layers,
        //         5
        //       )}} ]`
        //     );
        //   }
        //   configComplete = await askAboutLogForwarding(configComplete);
        //   await saveToServerlessYaml(configComplete);
        //   console.log(
        //     chalk`- The {green {bold serverless.yml}} file has been updated! ${emoji.rocket}\n`
        //   );
        //   return configComplete;
        // } catch (e) {
        //   console.log(
        //     chalk`- {red the attempt to parse the serverless config has failed at stage "${stage}"!} ${emoji.poop}`
        //   );
        //   console.log(
        //     `- The config sent in was:\n${JSON.stringify(accountInfo, null, 2)}`
        //   );
        //   console.log("- " + e.message);
        //   console.log(chalk`{dim ${e.stack}}`);
        //   console.log();
        //   process.exit();
        // }
    });
}
exports.buildServerlessMicroserviceProject = buildServerlessMicroserviceProject;

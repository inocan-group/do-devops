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
const shared_1 = require("../shared");
const chalk_1 = __importDefault(require("chalk"));
const isServerless_1 = require("../shared/serverless/isServerless");
const commandLineArgs = require("command-line-args");
const ssm_1 = require("./options/ssm");
/**
 * Description of command for help text
 */
function description() {
    return "allows an easy CRUD-based interaction with AWS's SSM parameter system for managing secrets.";
}
exports.description = description;
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield shared_1.getConfig();
        const subCommand = argv[0];
        const ssmCmd = commandLineArgs(ssm_1.DoSsmOptions, {
            argv: argv.slice(1),
            partial: true
        });
        // if no SSM config; write default value
        if (config.ssm === undefined) {
            const ssmConfig = {};
            yield shared_1.writeSection("ssm", ssmConfig);
            config.ssm = ssmConfig;
        }
        const ssmCommands = ["list", "get", "set"];
        if (!ssmCommands.includes(subCommand)) {
            console.log(`- please choose a ${chalk_1.default.italic("valid")} ${chalk_1.default.bold.yellow("SSM")} sub-command: ${ssmCommands.join(", ")}`);
            console.log();
            process.exit();
        }
        const serverless = yield isServerless_1.isServerless();
        if (serverless && serverless.isUsingTypescriptMicroserviceTemplate) {
            // TODO: build provider section from config
        }
        let slsConfig;
        if (serverless && serverless.hasServerlessConfig) {
            try {
                slsConfig = yield shared_1.getServerlessYaml();
                ssmCmd.ssm.region = ssmCmd.ssm.region || slsConfig.provider.region;
                ssmCmd.ssm.profile = ssmCmd.ssm.profile || slsConfig.provider.profile;
                ssmCmd.ssm.stage = ssmCmd.ssm.stage || slsConfig.provider.stage;
            }
            catch (e) {
                console.log("- Problem loading the serverless.yml file!\n");
                console.log(chalk_1.default.red("  " + e.message));
                process.exit();
            }
        }
        let importPath;
        switch (subCommand) {
            case "list":
                importPath = "./ssm/list";
                break;
            case "get":
                importPath = "./ssm/get";
                break;
            case "set":
                importPath = "./ssm/get";
                break;
        }
        const { execute } = (yield Promise.resolve().then(() => __importStar(require(importPath))));
        try {
            yield execute(ssmCmd);
        }
        catch (e) {
            console.log(`- Ran into error when running "ssm ${subCommand}":\n  ${chalk_1.default.red(e.message)}\n`);
            process.exit();
        }
    });
}
exports.handler = handler;

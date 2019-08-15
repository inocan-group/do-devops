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
const writeDefaultConfig_1 = require("../shared/writeDefaultConfig");
const async_shelljs_1 = require("async-shelljs");
const chalk_1 = __importDefault(require("chalk"));
const isServerless_1 = require("../shared/serverless/isServerless");
const commandLineArgs = require("command-line-args");
const ssm_1 = require("./options/ssm");
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield shared_1.getConfig();
        const subCommand = argv[0];
        const ssmCmd = commandLineArgs(ssm_1.DoSsmOptions, {
            argv: argv.slice(1),
            partial: true
        });
        // if no SSM config go get it
        if (config.ssm === undefined || config.ssm.hasAwsInstalled === undefined) {
            const whereIsConfig = yield isServerless_1.isServerless();
            const ssmConfig = {
                hasAwsInstalled: yield checkIfAwsInstalled(),
                findProfileIn: !whereIsConfig
                    ? "default"
                    : whereIsConfig.isUsingTypescriptMicroserviceTemplate
                        ? "typescript-microservice"
                        : whereIsConfig.hasServerlessConfig
                            ? "serverless-yaml"
                            : undefined
            };
            yield writeDefaultConfig_1.writeSection("ssm", ssmConfig);
            config.ssm = ssmConfig;
        }
        if (!config.ssm.hasAwsInstalled) {
            console.log(`- In order to run SSM commands you must install the AWS CLI`);
            console.log(chalk_1.default.grey("- for more info check out: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html"));
            console.log();
            process.exit();
        }
        const ssmCommands = ["list", "get", "set"];
        if (!ssmCommands.includes(subCommand)) {
            console.log(`- please choose a ${chalk_1.default.italic("valid")} ${chalk_1.default.bold.yellow("SSM")} command; these are: ${ssmCommands.join(", ")}`);
            console.log();
            process.exit();
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
        const { execute } = yield Promise.resolve().then(() => __importStar(require(importPath)));
        yield execute(ssmCmd);
        let profile;
        // if (config.ssm.findProfileIn === "typescript-microservice") {
        //   profile =
        // }
    });
}
exports.handler = handler;
function checkIfAwsInstalled() {
    try {
        const test = async_shelljs_1.asyncExec(`aws`, { silent: true });
        return true;
    }
    catch (e) {
        return false;
    }
}

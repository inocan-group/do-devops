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
const process = __importStar(require("process"));
/**
 * Description of command for help text
 */
function description() {
    return "allows an easy CRUD-based interaction with AWS's SSM parameter system for managing secrets.";
}
exports.description = description;
exports.options = [
    {
        name: "profile",
        type: String,
        typeLabel: "<profileName>",
        group: "ssm",
        description: `set the AWS profile explicitly`
    },
    {
        name: "region",
        type: String,
        typeLabel: "<region>",
        group: "ssm",
        description: `set the AWS region explicitly`
    },
    {
        name: "stage",
        type: String,
        typeLabel: "<stage>",
        group: "ssm",
        description: `set the stage explicitly`
    },
    {
        name: "nonStandardPath",
        type: Boolean,
        group: "ssm",
        description: "allows the naming convention for SSM paths to be ignored for a given operation"
    }
];
function handler(argv, ssmOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const subCommand = argv[0];
        const opts = commandLineArgs(exports.options, {
            argv: argv.slice(1),
            partial: true
        });
        const subCmdOptions = Object.assign(Object.assign(Object.assign(Object.assign({}, ssmOptions), opts.all), opts.ssm), { params: opts._unknown });
        const ssmCommands = ["list", "get", "set"];
        if (!ssmCommands.includes(subCommand)) {
            console.log(`- please choose a ${chalk_1.default.italic("valid")} ${chalk_1.default.bold.yellow("SSM")} sub-command: ${ssmCommands.join(", ")}`);
            console.log();
            process.exit();
        }
        const serverless = yield isServerless_1.isServerless();
        if (serverless &&
            serverless.isUsingTypescriptMicroserviceTemplate &&
            !serverless.hasServerlessConfig) {
            yield shared_1.buildServerlessMicroserviceProject();
        }
        const profile = yield shared_1.determineProfile({
            cliOptions: subCmdOptions,
            interactive: true
        });
        const region = yield shared_1.determineRegion({
            cliOptions: subCmdOptions,
            interactive: true
        });
        const stage = yield shared_1.determineStage({ cliOptions: subCmdOptions.ssm });
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
            yield execute(Object.assign(Object.assign({}, subCmdOptions), { profile, region, stage }));
        }
        catch (e) {
            console.log(chalk_1.default `{red - Ran into error when running "ssm ${subCommand}":}\n  - ${e.message}\n`);
            console.log(chalk_1.default `{grey - ${e.stack}}`);
            process.exit(0);
        }
    });
}
exports.handler = handler;

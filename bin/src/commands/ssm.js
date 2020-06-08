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
exports.handler = exports.options = exports.examples = exports.commands = exports.syntax = exports.description = void 0;
const chalk = require("chalk");
const process = require("process");
const shared_1 = require("../shared");
const isServerless_1 = require("../shared/serverless/isServerless");
const commandLineArgs = require("command-line-args");
/**
 * Description of command for help text
 */
function description(...opts) {
    console.log("options", opts);
    return "allows an easy interaction with AWS's SSM parameter system for managing secrets.";
}
exports.description = description;
exports.syntax = "do ssm <sub-command> <options>";
exports.commands = [
    {
        name: "list",
        summary: "lists the SSM secrets for a given profile and region",
    },
    { name: "get", summary: "get details on a specific secret" },
    { name: "set", summary: "set the value for a given secret" },
];
exports.examples = ["do ssm list", "do ssm list --profile myproject", "do ssm add DEV/TRELLO/SID abcdefg1234"];
exports.options = [
    {
        name: "profile",
        type: String,
        typeLabel: "<profileName>",
        group: "ssm",
        description: `set the AWS profile explicitly`,
    },
    {
        name: "region",
        type: String,
        typeLabel: "<region>",
        group: "ssm",
        description: `set the AWS region explicitly`,
    },
    {
        name: "stage",
        type: String,
        typeLabel: "<stage>",
        group: "ssm",
        description: `set the stage explicitly`,
    },
    {
        name: "nonStandardPath",
        type: Boolean,
        group: "ssm",
        description: "allows the naming convention for SSM paths to be ignored for a given operation",
    },
];
function handler(argv, ssmOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const subCommand = argv[0];
        const opts = commandLineArgs(exports.options, {
            argv: argv.slice(1),
            partial: true,
        });
        const subCmdOptions = Object.assign(Object.assign(Object.assign(Object.assign({}, ssmOptions), opts.all), opts.ssm), { params: opts._unknown });
        const ssmCommands = ["list", "get", "set"];
        if (!ssmCommands.includes(subCommand)) {
            console.log(`- please choose a ${chalk.italic("valid")} ${chalk.bold.yellow("SSM")} sub-command: ${ssmCommands.join(", ")}`);
            console.log();
            process.exit();
        }
        const serverless = yield isServerless_1.isServerless();
        if (serverless && serverless.isUsingTypescriptMicroserviceTemplate && !serverless.hasServerlessConfig) {
            yield shared_1.buildLambdaTypescriptProject();
        }
        const profile = yield shared_1.determineProfile({
            cliOptions: subCmdOptions,
            interactive: true,
        });
        const region = yield shared_1.determineRegion({
            cliOptions: subCmdOptions,
            interactive: true,
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
        const { execute } = (yield Promise.resolve().then(() => require(importPath)));
        try {
            yield execute(Object.assign(Object.assign({}, subCmdOptions), { profile, region, stage }));
        }
        catch (e) {
            console.log(chalk `{red - Ran into error when running "ssm ${subCommand}":}\n  - ${e.message}\n`);
            console.log(chalk `{grey - ${e.stack}}`);
            process.exit(0);
        }
    });
}
exports.handler = handler;
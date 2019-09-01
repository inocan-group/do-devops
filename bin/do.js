#!/usr/bin/env node
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
const shared_1 = require("./shared");
const commandLineArgs = require("command-line-args");
const chalk_1 = __importDefault(require("chalk"));
const commands_1 = require("./shared/commands");
const help_1 = require("./commands/help");
(() => __awaiter(this, void 0, void 0, function* () {
    const command = [
        { name: "command", defaultOption: true },
        ...shared_1.globalOptions
    ];
    const mainCommand = commandLineArgs(command, { stopAtFirstUnknown: true });
    const cmd = (mainCommand._all || {}).command;
    let argv = mainCommand._unknown || [];
    let opts = mainCommand.global;
    console.log(chalk_1.default.bold.white(`do ${chalk_1.default.green.italic.bold(cmd ? cmd + " " : "Help")}\n`));
    if (!cmd) {
        yield help_1.help(opts);
    }
    if (commands_1.commands().includes(cmd)) {
        opts =
            commandLineArgs(yield shared_1.globalAndLocalOptions({}, cmd), {
                partial: true
            }) || {};
        let subModule = shared_1.getCommandInterface(cmd);
        const subModuleArgv = opts._unknown.filter((i) => i !== cmd);
        const subModuleOpts = opts._all;
        if (subModuleOpts.help) {
            yield help_1.help(subModuleOpts, cmd);
        }
        yield subModule.handler(subModuleArgv, subModuleOpts);
    }
    else {
        console.log(`${chalk_1.default.bold.red("DO:")} "${cmd}" is an unknown command! \n\n` +
            `- Valid command syntax is: ${chalk_1.default.bold("do [command] <options>")}\n  where valid commands are: ${chalk_1.default.italic(commands_1.commands().join(", "))}\n` +
            `- If you want more help use the ${shared_1.inverted(" --help ")} option\n`);
    }
}))();

#!/usr/bin/env node
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
const process = require("process");
const shared_1 = require("./shared");
const commands_1 = require("./shared/commands");
const help_1 = require("./commands/help");
const commandLineArgs = require("command-line-args");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const command = [{ name: "command", defaultOption: true }, ...shared_1.globalOptions];
    const mainCommand = commandLineArgs(command, { stopAtFirstUnknown: true });
    const cmd = (mainCommand._all || {}).command;
    let argv = mainCommand._unknown || [];
    let opts = mainCommand.global;
    console.log(chalk.bold.white(`do ${chalk.green.italic.bold(cmd ? cmd + " " : "Help")}\n`));
    if (!cmd) {
        yield help_1.help(opts);
    }
    if (commands_1.commands().includes(cmd)) {
        opts =
            commandLineArgs(yield shared_1.globalAndLocalOptions({}, cmd), {
                partial: true,
            }) || {};
        let subModule = shared_1.getCommandInterface(cmd);
        const subModuleArgv = opts._unknown.filter((i) => i !== cmd);
        const subModuleOpts = opts._all;
        if (subModuleOpts.help) {
            yield help_1.help(subModuleOpts, cmd);
        }
        try {
            yield subModule.handler(subModuleArgv, subModuleOpts);
        }
        catch (e) {
            console.log(chalk `{red - unhandled {bold do} error!}`);
            console.log(`- ${e.message}`);
            console.log(chalk `{grey ${e.stack}}\n`);
            process.exit();
        }
    }
    else {
        console.log(`${chalk.bold.red("DO:")} "${cmd}" is an unknown command! \n\n` +
            `- Valid command syntax is: ${chalk.bold("do [command] <options>")}\n  where valid commands are: ${chalk.italic(commands_1.commands().join(", "))}\n` +
            `- If you want more help use the ${shared_1.inverted(" --help ")} option\n`);
    }
}))();

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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("./shared");
const commandLineArgs = require("command-line-args");
const chalk_1 = __importDefault(require("chalk"));
const shared_2 = require("./shared");
const help_1 = require("./commands/help");
(() => __awaiter(this, void 0, void 0, function* () {
    const command = [
        { name: "command", defaultOption: true },
        ...shared_1.DoGlobalOptions
    ];
    const mainCommand = commandLineArgs(command, { stopAtFirstUnknown: true });
    const cmd = (mainCommand._all || {}).command;
    let argv = mainCommand._unknown || [];
    const opts = mainCommand.global;
    console.log(chalk_1.default.bold.white.underline(`DevOps [DO] ${chalk_1.default.italic.bold(cmd ? cmd + " " : "Help")}\n`));
    if (!cmd) {
        help_1.help(shared_1.DoGlobalOptions, cmd);
    }
    if (shared_2.commands().includes(cmd)) {
        let subModule = yield Promise.resolve().then(() => __importStar(require(`./commands/${cmd}`)));
        yield subModule.handler(argv, opts);
    }
    else {
        console.log(`${chalk_1.default.bold.red("DO:")} "${cmd}" is an unknown command!\n\n` +
            `- Valid command syntax is: ${chalk_1.default.bold("do [command] <options>")}\n  where valid commands are: ${chalk_1.default.italic(shared_2.commands().join(", "))}\n` +
            `- If you want more help use the ${shared_1.inverted(" --help ")} option\n`);
    }
}))();

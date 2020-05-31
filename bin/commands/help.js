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
const commandLineUsage = require("command-line-usage");
const ui_1 = require("../shared/ui");
const shared_1 = require("../shared");
function help(opts, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commands, description, syntax, options } = yield getHelpMeta(opts, fn);
        const sections = [
            {
                header: "Description",
                content: description,
            },
            {
                header: "Syntax",
                content: syntax,
            },
        ];
        if (commands && commands.length > 0) {
            sections.push({
                header: fn ? `${fn.toUpperCase()} Sub-Commands` : "Commands",
                content: commands,
            });
        }
        if (fn) {
            sections.push({
                header: "Options",
                optionList: options,
            });
        }
        try {
            console.log(commandLineUsage(sections));
        }
        catch (e) {
            console.log(`  - ${"\uD83D\uDCA9" /* poop */}  ${chalk.red("Problem displaying help:")} ${e.message}\n`);
            console.log(chalk.grey(e.stack));
        }
        console.log();
        process.exit();
    });
}
exports.help = help;
function getHelpMeta(opts, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const commands = yield ui_1.getCommands(fn);
            const syntax = yield ui_1.getSyntax(fn);
            const options = yield shared_1.getOptions(opts, fn);
            const description = yield ui_1.getDescription(opts, fn);
            return { commands, options, syntax, description };
        }
        catch (e) {
            console.log(`  - ${"\uD83D\uDCA9" /* poop */}  ${chalk.red.bold("Problem getting help meta:")} ${e.messsage}\n`);
            console.log(chalk.grey(e.stack));
            process.exit();
        }
    });
}

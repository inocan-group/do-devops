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
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const chalk_1 = __importDefault(require("chalk"));
const ui_1 = require("../shared/ui");
const shared_1 = require("../shared");
function help(opts, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commands, description, syntax, options } = yield getHelpMeta(opts, fn);
        const sections = [
            {
                header: "Description",
                content: description
            },
            {
                header: "Syntax",
                content: syntax
            }
        ];
        if (commands && commands.length > 0) {
            sections.push({
                header: "Commands",
                content: commands
            });
        }
        if (fn) {
            sections.push({
                header: "Options",
                optionList: options
            });
        }
        try {
            console.log(command_line_usage_1.default(sections));
        }
        catch (e) {
            console.log(`  - ${"\uD83D\uDCA9" /* poop */}  ${chalk_1.default.red("Problem displaying help:")} ${e.message}\n`);
            console.log(chalk_1.default.grey(e.stack));
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
            console.log(`  - ${"\uD83D\uDCA9" /* poop */}  ${chalk_1.default.red.bold("Problem getting help meta:")} ${e.messsage}\n`);
            console.log(chalk_1.default.grey(e.stack));
            process.exit();
        }
    });
}

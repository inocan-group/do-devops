"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const chalk_1 = __importDefault(require("chalk"));
const shared_1 = require("../shared");
function help(optionList, fn) {
    const sections = [
        {
            header: "Description",
            content: chalk_1.default `DevOps [DO] toolkit is a simple CLI interface to `
        }
    ];
    if (!fn) {
        sections.push({
            header: "Syntax",
            content: `ssm [command] <options>`
        });
        sections.push({
            header: "Commands",
            content: `valid commands are: ${chalk_1.default.grey.italic(shared_1.commands().join(", "))}`
        });
    }
    else {
        sections.push({
            header: "Syntax",
            content: `ssm ${fn} <options>`
        });
    }
    sections.push({
        header: "Options",
        optionList
    });
    console.log(command_line_usage_1.default(sections));
    process.exit();
}
exports.help = help;

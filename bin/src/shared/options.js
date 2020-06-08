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
exports.globalOptions = exports.globalAndLocalOptions = void 0;
const chalk = require("chalk");
const getCommandInterface_1 = require("./getCommandInterface");
/**
 * A list of all options from all commands (including global options)
 */
function globalAndLocalOptions(optsSet, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = exports.globalOptions;
        const cmdDefn = getCommandInterface_1.getCommandInterface(fn);
        if (cmdDefn.options) {
            const localOptions = typeof cmdDefn.options === "object" ? cmdDefn.options : yield cmdDefn.options(optsSet);
            options = options.concat(localOptions);
        }
        return options;
    });
}
exports.globalAndLocalOptions = globalAndLocalOptions;
exports.globalOptions = [
    {
        name: "output",
        alias: "o",
        type: String,
        group: "global",
        description: "sends output to the filename specified (in JSON format)",
        typeLabel: "<filename>",
    },
    {
        name: "quiet",
        alias: "q",
        type: Boolean,
        group: "global",
        description: chalk `stops all output to {italic stdout}`,
    },
    {
        name: "verbose",
        alias: "v",
        type: Boolean,
        group: "global",
        description: "makes the output more verbose",
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        group: "global",
        description: "shows help for given command",
    },
];

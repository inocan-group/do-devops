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
exports.handler = void 0;
const shared_1 = require("../../../shared");
const subCommands = require("../private/subCommands/index");
const chalk = require("chalk");
const index_1 = require("../private/index");
/**
 * Validate a set of known sub-commands and return
 */
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const subCommand = argv[0];
        if (!Object.keys(subCommands).includes(subCommand)) {
            throw new Error(chalk `The subcommand "${subCommand}" is unknown to {bold validate}! Valid subcommands include:\n\n{grey ${Object.keys(subCommands).join(", ")}}`);
        }
        const defaultAction = opts.default ? opts.default : "none";
        const warnBranches = opts.warn ? opts.warn.split(",") : [];
        const errorBranches = opts.error ? opts.error.split(",") : [];
        const currentBranch = yield shared_1.getCurrentGitBranch();
        const action = index_1.includedIn(currentBranch, errorBranches)
            ? "error"
            : index_1.includedIn(currentBranch, warnBranches)
                ? "warn"
                : defaultAction;
        if (action !== "none") {
            const cmdDefn = subCommands[subCommand];
            process.exit(yield cmdDefn.handler(action, currentBranch, opts));
        }
        process.exit();
    });
}
exports.handler = handler;

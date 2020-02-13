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
const chalk_1 = __importDefault(require("chalk"));
const commands_1 = require("../commands");
const options_1 = require("../options");
function getCommands(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        let meta = [];
        let bold = false;
        if (fn) {
            const defn = yield Promise.resolve().then(() => __importStar(require(`../../commands/${fn}`)));
            meta = defn.commands ? defn.commands : [];
        }
        else {
            for (const cmd of commands_1.commands()) {
                const ref = yield Promise.resolve().then(() => __importStar(require(`../../commands/${cmd}`)));
                meta.push({
                    name: cmd,
                    summary: bold
                        ? chalk_1.default.bold(ref.description ? ref.description() : "")
                        : ref.description
                            ? typeof ref.description === "function"
                                ? yield ref.description()
                                : ref.description
                            : ""
                });
            }
        }
        return formatCommands(meta);
    });
}
exports.getCommands = getCommands;
/**
 * Formats commands so that:
 *
 * 1. alternating white/dim per line item
 * 2. multi-line descriptions are truncated to first line
 */
function formatCommands(cmds) {
    let dim = false;
    return cmds.map(cmd => {
        cmd.name = dim ? `{dim ${cmd.name}}` : cmd.name;
        const summary = Array.isArray(cmd.summary)
            ? cmd.summary.split("\n")[0]
            : cmd.summary;
        console.log(summary, cmd.summary);
        cmd.summary = dim ? `{dim ${summary}}` : summary;
        dim = !dim;
        return cmd;
    });
}
/**
 * Gets the syntax for the help system for both "global help"
 * as well as on a per function basis. The syntax for a function
 * can be manually set by providing a `syntax` symbol on the
 * command. If not provided a default syntax will be used.
 */
function getSyntax(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fn) {
            return "do [command] <options>";
        }
        const defn = yield Promise.resolve().then(() => __importStar(require(`../../commands/${fn}`)));
        const hasSubCommands = defn.subCommands ? true : false;
        return defn.syntax
            ? defn.syntax
            : `do ${fn} ${hasSubCommands ? "[command] " : ""}<options>`;
    });
}
exports.getSyntax = getSyntax;
/**
 * Gets the "description" content for the help area
 */
function getDescription(opts, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fn) {
            return `DevOps toolkit [ ${chalk_1.default.bold.italic("do")} ] is a simple CLI interface intended to automate most of the highly repeatable tasks on your team.`;
        }
        const defn = yield Promise.resolve().then(() => __importStar(require(`../../commands/${fn}`)));
        const hasDescription = defn.description ? true : false;
        const defnIsFunction = typeof defn.description === "function";
        return hasDescription
            ? defnIsFunction
                ? yield defn.description(opts)
                : defn.description
            : `Help content for the {bold do}'s ${chalk_1.default.bold.green.italic(fn)} command.`;
    });
}
exports.getDescription = getDescription;
/**
 *
 * @param opts
 * @param fn
 */
function getExamples(opts, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        // nothing to do if no function is chosen
        if (fn) {
            const defn = yield Promise.resolve().then(() => __importStar(require(`../../commands/${fn}`)));
            const hasExamples = defn.examples ? true : false;
            const defnIsFunction = typeof defn.examples === "function";
            if (hasExamples) {
                if (!defnIsFunction && !Array.isArray(defn.examples)) {
                    throw new Error(`Getting help on "${fn}" has failed because the examples section -- while configured -- is of the wrong format! Should be a function returning an array or an array of .`);
                }
                const examples = defnIsFunction ? defn.examples(opts) : defn.examples;
            }
            return hasExamples
                ? defnIsFunction
                    ? yield defn.description(opts)
                    : defn.description
                : ``;
        }
    });
}
exports.getExamples = getExamples;
function getOptions(opts, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = [];
        if (fn) {
            const defn = yield Promise.resolve().then(() => __importStar(require(`../../commands/${fn}`)));
            if (defn.options) {
                options = options.concat(typeof defn.options === "function"
                    ? yield defn.options(opts)
                    : defn.options);
            }
        }
        options = options.concat(options_1.globalOptions);
        return options;
    });
}
exports.getOptions = getOptions;

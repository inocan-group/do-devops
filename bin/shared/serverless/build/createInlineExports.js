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
const path = require("path");
const file_1 = require("../../file");
const index_1 = require("../../ast/index");
const do_config_1 = require("../../do-config");
const npm_1 = require("../../npm");
const path_1 = require("path");
const fs_1 = require("fs");
/**
 * Writes the serverless configuration file which contains
 * all the _inline_ function definitions found under `src/handlers`.
 *
 * **Note:** if the build tool is _webpack_ and the `serverless-webpack`
 * plugin is _not_ installed then it the inline functions will instead
 * be pointed to the transpiled location in the `.webpack` directory with
 * an `package: { artifact: fn.zip }`
 */
function createInlineExports(handlers) {
    return __awaiter(this, void 0, void 0, function* () {
        const bespokeWebpack = (yield do_config_1.getConfig()).build.buildTool === "webpack" && !npm_1.hasDevDependency("serverless-webpack");
        const header = 'import { IServerlessFunction } from "common-types";\n';
        let body = [];
        const config = [];
        handlers.forEach((handler) => {
            // const comments = findHandlerComments(handler);
            const handlerConfig = index_1.findHandlerConfig(handler.source, bespokeWebpack);
            if (handlerConfig) {
                config.push(handlerConfig);
            }
            else {
                console.log(chalk `- ${"\uD83D\uDCA9" /* poop */} the {red ${file_1.relativePath(handler.source)}} file will be ignored as a handler as it has no CONFIG section defined. This is probably a mistake!`);
            }
        });
        const exportSymbols = [];
        warnAboutMissingTyping(config);
        config.forEach((handler) => {
            const fnName = handler.config.handler
                .split("/")
                .pop()
                .replace(/\.[^.]+$/, "");
            exportSymbols.push(fnName);
            const symbol = `const ${fnName}: IServerlessFunction = { 
${objectPrint(handler.config)}
}
`;
            body.push(symbol);
        });
        const file = `
${header}
${body.join("\n")}

export default {
  ${exportSymbols.join(",\n\t")}
}`;
        fs_1.writeFileSync(path.join(process.env.PWD, "serverless-config/functions/inline.ts"), file, {
            encoding: "utf-8",
        });
    });
}
exports.createInlineExports = createInlineExports;
function objectPrint(obj) {
    let contents = [];
    Object.keys(obj).forEach((key) => {
        let value = obj[key];
        if (typeof value === "string") {
            value = `"${value.replace(/"/g, '\\"')}"`;
        }
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        contents.push(`  ${key}: ${value}`);
        return contents.join(",\n\t");
    });
    return contents;
}
function convertToWebpackResource(fn) {
    return path_1.join(".webpack/", fn.split("/").pop().replace(".ts", ".js"));
}
function warnAboutMissingTyping(config) {
    const incorrectOrMissingTyping = config.filter((i) => i.interface !== "IWrapperFunction");
    if (incorrectOrMissingTyping.length > 0) {
        console.log(chalk `- there were ${String(incorrectOrMissingTyping.length)} handler functions who defined a {italic config} but did not type it as {bold IWrapperFunction}`);
        console.log(chalk `{grey - the function configs needing attention are: {italic ${incorrectOrMissingTyping
            .map((i) => i.config.handler)
            .join(", ")}}}`);
    }
}

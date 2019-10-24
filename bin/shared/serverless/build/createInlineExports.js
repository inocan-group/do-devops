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
const index_1 = require("../../ast/index");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
/**
 * Writes the serverless configuration file which contains
 * all the _inline_ function definitions found under `src/handlers`.
 */
function createInlineExports(files) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = 'import { IServerlessFunction } from "common-types";\n';
        let body = [];
        const config = [];
        files.forEach(handler => {
            // const comments = findHandlerComments(handler);
            config.push(index_1.findHandlerConfig(handler));
        });
        const exportSymbols = [];
        const incorrectOrMissingTyping = config.filter(i => i.interface !== "IWrapperFunction");
        if (incorrectOrMissingTyping.length > 0) {
            console.log(chalk_1.default `- there were ${String(incorrectOrMissingTyping.length)} handler functions who defined a {italic config} but did not type it as {bold IWrapperFunction}`);
            console.log(chalk_1.default `{grey - the function configs needing attention are: {italic ${incorrectOrMissingTyping
                .map(i => i.config.handler)
                .join(", ")}}}`);
        }
        config.forEach(handler => {
            const fnName = handler.config.handler
                .split("/")
                .pop()
                .replace(".ts", "");
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
            encoding: "utf-8"
        });
    });
}
exports.createInlineExports = createInlineExports;
function objectPrint(obj) {
    let contents = [];
    Object.keys(obj).forEach(key => {
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

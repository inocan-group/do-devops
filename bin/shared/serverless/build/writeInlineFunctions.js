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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const writeFile = util_1.promisify(fs.writeFile);
/**
 * Writes to the `serverless-config/functions/inline.ts` file
 * all of the handler functions which were found off the "handlers"
 * directory.
 *
 * The configuration will only include the reference to the `handler`
 * file unless the function exports a `config` property to express
 * other configuration properties.
 */
function writeInlineFunctions(handlers, functionRoot = "src", fileName = "inline") {
    return __awaiter(this, void 0, void 0, function* () {
        let contents = 'import { IServerlessFunction } from "common-types";\n\n';
        const fnNames = [];
        for (const handler of handlers) {
            const localPath = handler.file.replace(/.*src\//, `${functionRoot}/`).replace(".ts", "");
            const functionName = handler.file
                .split("/")
                .pop()
                .replace(".ts", "");
            fnNames.push(functionName);
            let config = {
                handler: `${localPath}.handler`
            };
            if (handler.ref.config) {
                config = Object.assign(Object.assign({}, config), handler.ref.config);
            }
            contents += `const ${functionName}: IServerlessFunction = {\n`;
            Object.keys(config).forEach(key => {
                let value = config[key];
                if (typeof value === "string") {
                    value = `"${value.replace(/"/g, '\\"')}"`;
                }
                if (typeof value === "object") {
                    value = JSON.stringify(value);
                }
                contents += `  ${key}: ${value},\n`;
            });
            contents += "}\n\n";
        }
        contents += `export default {\n  ${fnNames.join(",\n  ")}\n}`;
        yield writeFile(path_1.default.join(process.cwd(), `serverless-config/functions/${fileName}.ts`), contents, {
            encoding: "utf-8"
        });
    });
}
exports.writeInlineFunctions = writeInlineFunctions;

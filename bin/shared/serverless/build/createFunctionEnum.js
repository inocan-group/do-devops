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
const findHandlerConfig_1 = require("../../ast/findHandlerConfig");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const write = util_1.promisify(fs_1.writeFile);
/**
 * creates an enumeration with all of the _functions_ which have
 * been defined in the project
 */
function createFunctionEnum(handlers) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = `export enum AvailableFunction {
`;
        const footer = `
}
  
export type IAvailableFunction = keyof typeof AvailableFunction;
`;
        let body = [];
        handlers.forEach(handler => {
            const config = findHandlerConfig_1.findHandlerConfig(handler.source);
            if (!config) {
                console.log(chalk_1.default `- ${"\uD83D\uDE21" /* angry */} also excluding the {italic ${handler.source
                    .split("/")
                    .pop()}} in the generated enumeration of handlers`);
            }
            else {
                const fn = handler.fn;
                const comment = config.config.description ? config.config.description : `${fn} handler`;
                body.push(`
  /**
   * ${comment}
   **/
  ${fn} = "${fn}"`);
            }
        });
        const fileText = `${header}${body.join(",")}${footer}`;
        yield write(path.resolve(path.join(process.cwd(), "/src/@types/functions.ts")), fileText, { encoding: "utf-8" });
        return fileText;
    });
}
exports.createFunctionEnum = createFunctionEnum;

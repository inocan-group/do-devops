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
const findHandlerConfig_1 = require("../../ast/findHandlerConfig");
const util_1 = require("util");
const fs_1 = require("fs");
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
        handlers.forEach((handler) => {
            const config = findHandlerConfig_1.findHandlerConfig(handler.source);
            if (!config) {
                console.log(chalk `- ${"\uD83D\uDE21" /* angry */} also excluding the {italic ${handler.source
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

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
exports.saveFunctionsTypeDefinition = void 0;
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const __1 = require("../..");
const util_1 = require("util");
const writeFile = util_1.promisify(fs.writeFile);
/**
 * Once a build is complete, this function will review the
 * _functions_ and _stepFunctions_ and then create a file
 * `src/@types/fns.ts` which has a **enum** for both types of
 * functions. This will allow completeness checking in
 * conductors and in other cases where you want to be made
 * aware at _design time_ when your reference to functions
 * is incorrect.
 *
 * Note that errors encountered are trapped so as to not block
 * completion but a warning message will be sent to the console.
 */
function saveFunctionsTypeDefinition(config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const functions = config.functions ? Object.keys(config.functions) : false;
            const stepFunctions = config.stepFunctions && config.stepFunctions.stateMachines
                ? Object.keys(config.stepFunctions.stateMachines)
                : false;
            let contents = "";
            if (functions) {
                contents += "export enum AvailableFunctions {";
                functions.forEach((f, i) => {
                    const description = config.functions[f].description ? config.functions[f].description : false;
                    contents += description ? `\n  /**\n   * ${description}\n   **/` : "";
                    const comma = i === functions.length - 1 ? "" : ",";
                    contents += `\n  ${f} = "${f}"${comma}`;
                });
                contents += "\n};\n";
            }
            if (stepFunctions) {
                // TODO: implement
            }
            const dir = path.join(process.cwd(), "src/@types");
            const filename = path.join(dir, "build.ts");
            yield __1.ensureDirectory(dir);
            yield writeFile(filename, contents, { encoding: "utf-8" });
        }
        catch (e) {
            console.log(chalk `- Attempt to save {italic type definitions} for {bold functions} and {bold stepFunctions} failed; this will be ignored for now so build can continue.`);
            console.log(chalk `- The actual error received was: {dim ${e.message}}`);
        }
    });
}
exports.saveFunctionsTypeDefinition = saveFunctionsTypeDefinition;

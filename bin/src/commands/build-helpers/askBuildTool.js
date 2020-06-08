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
exports.askBuildTool = void 0;
const chalk = require("chalk");
const _types_1 = require("../../@types");
const index_1 = require("../../shared/index");
const index_2 = require("./index");
const inquirer = require("inquirer");
/**
 * Asks for the primary build tool the user wants to use
 * for the repo. It will also return the value for further
 * processing.
 */
function askBuildTool(isServerless) {
    return __awaiter(this, void 0, void 0, function* () {
        const packages = Object.keys(index_1.getPackageJson().devDependencies);
        const findLikely = (exclude = null) => packages.find((i) => i === "bili" && i !== exclude)
            ? "bili"
            : packages.find((i) => i === "rollup" && i !== exclude)
                ? "rollup"
                : packages.find((i) => i === "webpack" && i !== exclude)
                    ? "webpack"
                    : packages.find((i) => i === "typescript" && i !== exclude)
                        ? "typescript"
                        : undefined;
        const mostLikely = findLikely();
        const alternative = findLikely(mostLikely);
        const ifTypescriptMessage = chalk `{reset
    
  {bold {white Note:}} since this is a {bold {blue Serverless}} project you may consider 
  using "none" to only build the {italic serverless.yml} file at build time. Alternatively,
  if you choose "webpack" it will allow you will be able to build both by adding the {blue 
  --force} parameter.

  }`;
        const message = chalk `Choose a build tool for this repo [ {grey {italic suggestion: }${mostLikely ? [mostLikely, alternative].filter((i) => i).join(", ") : "[ {grey no suggestions"}} ]${isServerless ? ifTypescriptMessage : ""}`;
        const choices = Object.keys(_types_1.BuildTool);
        const baseProfileQuestion = {
            type: "list",
            name: "buildTool",
            message,
            choices,
            default: mostLikely || choices[0],
        };
        const answer = yield inquirer.prompt(baseProfileQuestion);
        yield index_2.saveToolToRepoConfig(answer.buildTool);
        return answer.buildTool;
    });
}
exports.askBuildTool = askBuildTool;

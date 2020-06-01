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
exports.serverlessTranspilation = void 0;
const chalk = require("chalk");
const index_1 = require("../../shared/index");
const index_2 = require("../../shared/serverless/index");
const index_3 = require("../../shared/ast/index");
const matcher = require("matcher");
/**
 * Handles any needed transpilation for a **Serverless** project
 */
function serverlessTranspilation(c) {
    return __awaiter(this, void 0, void 0, function* () {
        const { argv, opts, config, tooling } = c;
        let fns;
        const validity = yield filterOutInvalidFunction(argv);
        if (opts.interactive || argv.length > 0) {
            fns = yield index_1.askForFunctions(validity.invalid.length > 0
                ? chalk `Some of the functions you stated were invalid [ {grey ${validity.invalid.join(", ")}} ].\nChoose the functions from the list below:`
                : "Which functions should be transpiled?", validity.valid.concat(validity.explicit).concat(validity.implicit));
        }
        else {
            fns = argv;
        }
        if (opts.force || fns.length > 0) {
            if (index_1.hasDevDependency("serverless-webpack")) {
                throw new index_1.DevopsError(`You have installed the 'serverless-webpack' plugin which indicates that transpilation will be done by the plugin at "deploy" time but you are forcing transpilation at build time.`, "do-devops/invalid-transpilation");
            }
            if (fns.length > 0) {
                console.log(chalk `{grey - transpiling {bold ${String(fns.length)}} handler functions {italic prior} to building {blue serverless.yml}}`);
            }
            fns = fns.length > 0 ? fns : index_3.getValidServerlessHandlers();
            yield tooling({ fns, opts });
            console.log();
        }
        else {
            console.log(chalk `{grey - {bold Note:} you're configured to use {bold "${config.buildTool}}" as your code build tool and do not appear to be
using the {italic serverless-webpack} plugin. This is entirely fine but code will not be
transpiled with the {italic build} command unless you include the {blue --force} switch.}`);
            console.log(chalk `\n{grey - {bold Note:} for most people using this config, {blue yarn do watch} will be the most efficient way
to ensure that you always have transpiled code when you {italic deploy}. If you do not then 
the {italic deploy} command will detect this and transpile at deploy-time.}\n`);
        }
    });
}
exports.serverlessTranspilation = serverlessTranspilation;
function filterOutInvalidFunction(fns) {
    return __awaiter(this, void 0, void 0, function* () {
        const validFns = Object.keys(yield index_2.getLocalServerlessFunctionsFromServerlessYaml());
        const results = {
            valid: [],
            invalid: [],
            /** shows fn names which were NOT a direct match but are a soft match */
            explicit: [],
            implicit: [],
        };
        fns.forEach((f) => {
            if (f.includes("*") || f.includes("!")) {
                // explicit soft match
                results.explicit = results.explicit.concat(...matcher(validFns, [f]));
            }
            else if (validFns.includes(f)) {
                results.valid.push(f);
            }
            else {
                // implicit soft match
                results.implicit = results.implicit.concat(...matcher(validFns, [f, `${f}*`]));
                results.invalid.push(f);
            }
        });
        return results;
    });
}

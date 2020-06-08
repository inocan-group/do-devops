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
exports.determineStage = void 0;
const chalk = require("chalk");
const process = require("process");
const index_1 = require("./index");
const lodash_1 = require("lodash");
/**
 * Uses various methods to determine which _stage_
 * the serverless function should be deployed to.
 * If the stage can not be determined than the user
 * will be asked interactively.
 *
 * @param opts the CLI options hash (which includes stage as
 * a possible parameter)
 */
function determineStage(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let stage = lodash_1.get(opts, "stage") || process.env.NODE_ENV || process.env.AWS_STAGE;
            if (!stage) {
                try {
                    stage = lodash_1.get(yield index_1.getServerlessYaml(), "provider.stage", undefined);
                }
                catch (e) { }
            }
            if (opts.interactive) {
                stage = yield index_1.askForStage();
            }
            return stage;
        }
        catch (e) {
            console.log(chalk `- attempts to get the desired "stage" have failed! ${"\uD83D\uDCA9" /* poop */}`);
            console.log(chalk `- {red ${e.message}}`);
            console.log(chalk `{dim ${e.stack}}`);
            console.log();
            process.exit();
        }
    });
}
exports.determineStage = determineStage;

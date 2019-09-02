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
const index_1 = require("./index");
const chalk_1 = __importDefault(require("chalk"));
const process = __importStar(require("process"));
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
            let stage = lodash_1.get(opts, "cliOptions.stage") ||
                process.env.NODE_ENV ||
                process.env.AWS_STAGE;
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
            console.log(chalk_1.default `- attempts to get the desired "stage" have failed! ${"\uD83D\uDCA9" /* poop */}`);
            console.log(chalk_1.default `- {red ${e.message}}`);
            console.log(chalk_1.default `{dim ${e.stack}}`);
            console.log();
            process.exit();
        }
    });
}
exports.determineStage = determineStage;

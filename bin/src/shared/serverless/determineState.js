"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const chalk_1 = __importDefault(require("chalk"));
const determineProfile_1 = require("./determineProfile");
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
            if (opts.stage) {
                return opts.stage;
            }
            const profile = yield determineProfile_1.determineProfile({ cliOptions: opts });
            const stage = opts.stage ||
                process.env.NODE_ENV ||
                process.env.AWS_STAGE ||
                (yield index_1.getServerlessYaml()).provider.stage;
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

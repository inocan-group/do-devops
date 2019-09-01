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
const getServerlessYaml_1 = require("./getServerlessYaml");
const index_1 = require("../index");
const chalk_1 = __importDefault(require("chalk"));
/**
 * Determines the appropriate `region` to point at based on CLI switches/options,
 * the Serverless configuration, and the global `do` config defaults.
 */
function determineRegion(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield index_1.getConfig();
        const cliRegion = opts.cliOptions && opts.cliOptions.region
            ? opts.cliOptions.region
            : undefined;
        let outcome = cliRegion ||
            process.env.AWS_REGION ||
            (yield getServerlessYaml_1.getServerlessYaml()).provider.region ||
            config.global.defaultAwsRegion;
        // USER Config is last resort
        if (!outcome) {
            const userConfig = yield index_1.getConfig({
                projectOrUserConfig: "user",
                exitIfNotFound: false
            });
            if (userConfig && userConfig.global.defaultAwsRegion) {
                if (opts.cliOptions && !opts.cliOptions.quiet) {
                    console.log(chalk_1.default `{bold - AWS region has been resolved using the User's config ${"\uD83D\uDC40" /* eyeballs */}}. This is the source of "last resort" but may be intended.`);
                }
                outcome = userConfig.global.defaultAwsRegion;
            }
        }
        return outcome;
    });
}
exports.determineRegion = determineRegion;

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
const determineProfile_1 = require("./determineProfile");
const lodash_1 = require("lodash");
const aws_1 = require("../aws");
const index_1 = require("../index");
const getServerlessYaml_1 = require("./getServerlessYaml");
/**
 * Determines the appropriate `region` to point at based on CLI switches/options,
 * the Serverless configuration, and the global `do` config defaults.
 */
function determineRegion(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield index_1.getConfig();
        const cliRegion = lodash_1.get(opts, "cliOptions.region");
        let outcome = cliRegion || process.env.AWS_REGION;
        if (!outcome) {
            try {
                outcome = lodash_1.get(yield getServerlessYaml_1.getServerlessYaml(), "provider.region", undefined);
            }
            catch (e) { }
        }
        if (!outcome) {
            outcome = lodash_1.get(config, "global.defaultAwsRegion", undefined);
        }
        if (!outcome) {
            try {
                const profileName = yield determineProfile_1.determineProfile(opts);
                const profile = yield aws_1.getAwsProfile(profileName);
                if (profile && profile.region) {
                    outcome = profile.region;
                }
            }
            catch (e) { }
        }
        // USER Config is last resort
        if (!outcome) {
            const userConfig = yield index_1.getConfig({
                projectOrUserConfig: "user",
                exitIfNotFound: false,
            });
            if (userConfig && userConfig.global.defaultAwsRegion) {
                if (opts.cliOptions && !opts.cliOptions.quiet) {
                    console.log(chalk `{bold - AWS region has been resolved using the User's config ${"\uD83D\uDC40" /* eyeballs */}}. This is the source of "last resort" but may be intended.`);
                }
                outcome = userConfig.global.defaultAwsRegion;
            }
        }
        return outcome;
    });
}
exports.determineRegion = determineRegion;

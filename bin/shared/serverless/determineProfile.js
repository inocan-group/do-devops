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
const index_1 = require("../index");
const lodash_1 = require("lodash");
/** ensure that during one CLI operation we cache this value */
let profile;
/**
 * Based on CLI, serverless info, and config files, determine which
 * AWS `profile` the serverless command should leverage for credentials
 * as well as -- optionally -- the _region_. Sequence is:
 *
 * - look at `CLI switches` for explicit statement about profile
 * - if serverlessYaml, use serverless config to determine
 * - look at the global default for the `project configuration`
 * - look at the global default for the `user configuration`
 * - if "interactive", then ask user for profile name from available options
 */
function determineProfile(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (lodash_1.get(opts, "cliOptions.profile")) {
            return opts.cliOptions.profile;
        }
        if (lodash_1.get(opts, "cliOptions.profile", undefined)) {
            return opts.cliOptions.profile;
        }
        let serverlessYaml;
        try {
            serverlessYaml = yield index_1.getServerlessYaml();
            if (lodash_1.get(serverlessYaml, "provider.profile", undefined)) {
                profile = serverlessYaml.provider.profile;
                return profile;
            }
        }
        catch (e) {
            // nothing to do
        }
        let projectConfig;
        let userConfig;
        try {
            projectConfig = yield index_1.getConfig({
                exitIfNotFound: false,
                projectOrUserConfig: "project"
            });
        }
        catch (e) { }
        try {
            userConfig = yield index_1.getConfig({
                exitIfNotFound: false,
                projectOrUserConfig: "user"
            });
        }
        catch (e) { }
        if (projectConfig && projectConfig.global.defaultAwsProfile) {
            profile = projectConfig.global.defaultAwsProfile;
        }
        else if (userConfig && userConfig.global.defaultAwsProfile) {
            profile = userConfig.global.defaultAwsProfile;
        }
        else if (opts.interactive) {
            try {
                profile = yield index_1.askForAwsProfile({ exitOnError: false });
            }
            catch (e) { }
        }
        if (!profile) {
            throw new index_1.DevopsError(`Could not determine the AWS profile! [ ${JSON.stringify(opts)}]`, "devops/not-ready");
        }
        return profile;
    });
}
exports.determineProfile = determineProfile;

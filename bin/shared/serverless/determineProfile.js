"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
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
        if (profile) {
            return profile;
        }
        if (opts.cliOptions.profile) {
            return opts.cliOptions.profile;
        }
        let serverlessYaml;
        try {
            serverlessYaml = yield index_1.getServerlessYaml();
            if (serverlessYaml.provider.profile) {
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
            profile = projectConfig.ssm.defaultProfile;
        }
        else if (userConfig && userConfig.global.defaultAwsProfile) {
            profile = userConfig.ssm.defaultProfile;
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

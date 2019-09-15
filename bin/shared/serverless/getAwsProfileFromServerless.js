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
Object.defineProperty(exports, "__esModule", { value: true });
const isServerless_1 = require("./isServerless");
const errors_1 = require("../errors");
const chalk_1 = __importDefault(require("chalk"));
const getServerlessYaml_1 = require("./getServerlessYaml");
const index_1 = require("./index");
/**
 * Returns the **AWS Profile** which is used as part
 * of the serverless configuration.
 *
 * If the project is detected to be a `serverless-microservice`
 * derived project then it will build the configuration first if
 * the serverless.yml is missing.
 */
function getAwsProfileFromServerless() {
    return __awaiter(this, void 0, void 0, function* () {
        const sls = yield isServerless_1.isServerless();
        let config;
        if (!sls) {
            throw new errors_1.DevopsError(`Attempt to get the AWS profile from the serverless config failed because this project is not setup as a serverless project!`, "devops/not-allowed");
        }
        if ((!sls.hasServerlessConfig || !sls.hasProviderSection) &&
            sls.isUsingTypescriptMicroserviceTemplate) {
            if (!sls.hasServerlessConfig) {
                console.log(chalk_1.default `- it appears that the {green serverless.yml} {italic does not} exist; will build from {italic serverless-microservice} config ${"\uD83E\uDD16" /* robot */}`);
            }
            else {
                console.log(chalk_1.default `- it appears that the {green serverless.yml} does not have the {bold provider} section; will build from {italic serverless-microservice} config ${"\uD83E\uDD16" /* robot */}`);
            }
            yield index_1.buildServerlessMicroserviceProject();
        }
        try {
            config = yield getServerlessYaml_1.getServerlessYaml();
            if (!config.provider) {
                console.log(chalk_1.default `- the {red serverless.yaml} file doesn't have a {bold provider} section! ${"\uD83D\uDCA9" /* poop */}`);
                console.log("- this section must exist before you can deploy\n");
                process.exit();
            }
            return config.provider.profile;
        }
        catch (e) {
            console.log(chalk_1.default `- {red serverless.yml} file is missing! ${"\uD83D\uDCA9" /* poop */}`);
            console.log(`- this file must exist before you can deploy\n`);
            process.exit();
        }
    });
}
exports.getAwsProfileFromServerless = getAwsProfileFromServerless;

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
const serverlessConfig_1 = require("./serverlessConfig");
const shared_1 = require("../shared");
const inquirer = require("inquirer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Gets the "default" profile for a given repo based on:
 *
 * - the `serverless.yml` file
 * - the `do.config.js` file
 *
 * If not found it will switch over to _interactive mode_.
 */
function getDefaultAwsProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        const serverlessYaml = yield serverlessConfig_1.getServerlessYml();
        const config = yield shared_1.getConfig();
        let profile;
        if (serverlessYaml && serverlessYaml.provider.profile) {
            profile = serverlessYaml.provider.profile;
        }
        else if (config.ssm.defaultProfile) {
            profile = config.ssm.defaultProfile;
        }
        else {
            profile = yield askForAwsProfile();
        }
    });
}
exports.getDefaultAwsProfile = getDefaultAwsProfile;
/**
 * Returns the path to the file if found, if not found then returns
 * `false`.
 */
function hasAwsProfileCredentialsFile() {
    const homedir = require("os").homedir();
    const filePath = path_1.default.join(homedir, ".aws/credentials");
    return fs_1.default.existsSync(filePath) ? filePath : false;
}
exports.hasAwsProfileCredentialsFile = hasAwsProfileCredentialsFile;
/**
 * Interogates the `~/.aws/credentials` file to get a list of
 * profiles the user has available. Returns _false_ if the credentials file
 * is not found.
 *
 * Alternatively you can state a particular `profile` which you
 * want the details on by specifying the profile name as part of
 * the calling arguments. In this case if the profile stated is
 * not found it will throw the error `do-devops/not-found`
 */
function getAwsProfileList(profile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentialsFile = hasAwsProfileCredentialsFile();
            if (!credentialsFile) {
                return false;
            }
            const filter = profile
                ? /* filter down to only a given profile */
                    (i) => i.includes(profile)
                : /** accept all profiles */
                    (i) => true;
            let credentials = fs_1.default
                .readFileSync(credentialsFile, { encoding: "utf-8" })
                .split("[")
                .filter(filter)
                .map(i => i.split("\n"))
                .map(x => {
                return x.map(i => {
                    let obj;
                    if (i.includes("aws_access_key_id")) {
                        obj.accessKeyId = i.replace(/.*aws_access_key_id\s*=\s*/, "");
                    }
                    if (i.includes("aws_secret_access_key")) {
                        obj.secretAccessKey = i.replace(/.*aws_secret_access_key\s*=\s*/, "");
                    }
                    return obj;
                });
            })
                .pop()
                .slice(1, 3);
            return profile ? credentials[0] : credentials;
        }
        catch (e) {
            return false;
        }
    });
}
exports.getAwsProfileList = getAwsProfileList;
function getAwsProfileInfo(profile) { }
/**
 * Asks the user to choose an AWS profile
 */
function askForAwsProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        const profiles = yield getAwsProfileList();
        const question = {
            type: "input",
            name: "profile",
            message: "Choose an AWS profile from your credentials file"
        };
        const answer = yield inquirer.prompt(question);
        return;
    });
}
exports.askForAwsProfile = askForAwsProfile;
/**
 * Asks the user to choose an AWS region
 */
function askForAwsRegion() {
    return __awaiter(this, void 0, void 0, function* () {
        const question = {
            type: "list",
            name: "region",
            message: "What AWS region do you want to target?",
            default: "us-east-1",
            choices: [
                "us-east-1",
                "us-east-2",
                "us-west-1",
                "us-west-2",
                "eu-west-1",
                "eu-west-2",
                "eu-west-3",
                "eu-north-1",
                "eu-central-1",
                "sa-east-1",
                "ca-central-1",
                "ap-south-1",
                "ap-northeast-1",
                "ap-northeast-2",
                "ap-northeast-3",
                "ap-southeast-1",
                "ap-southeast-2"
            ]
        };
        return;
    });
}
exports.askForAwsRegion = askForAwsRegion;

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
const getServerlessYaml_1 = require("../serverless/getServerlessYaml");
const __1 = require("..");
const inquirer = require("inquirer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readFile_1 = require("../readFile");
const DevopsError_1 = require("../errors/DevopsError");
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
        let serverlessYaml;
        try {
            serverlessYaml = yield getServerlessYaml_1.getServerlessYaml();
        }
        catch (e) {
            serverlessYaml = false;
        }
        const config = yield __1.getConfig();
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
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 * Returns _false_ if the credentials file is not found.
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
            const data = yield readFile_1.readFile(credentialsFile);
            const targets = ["aws_access_key_id", "aws_secret_access_key", "region"];
            // extracts structured information from the semi-structured
            // array of arrays
            const extractor = (agg, curr) => {
                let profileSection = "unknown";
                curr.forEach(lineOfFile => {
                    if (lineOfFile.slice(-1) === "]") {
                        profileSection = lineOfFile.slice(0, lineOfFile.length - 1);
                        agg[profileSection] = {};
                    }
                    targets.forEach(t => {
                        if (lineOfFile.includes(t)) {
                            const [devnull, key, value] = lineOfFile.match(/\s*(\S+)\s*=\s*(\S+)/);
                            agg[profileSection][key] = value;
                        }
                    });
                });
                return agg;
            };
            const credentials = data
                .split("[")
                .map(i => i.split("\n"))
                .reduce(extractor, {});
            if (profile && !credentials[profile]) {
                throw new DevopsError_1.DevopsError(`The profile "${profile}" was not found in the credentials file.`, "devops/not-found");
            }
            return profile ? credentials[profile] : credentials;
        }
        catch (e) {
            return false;
        }
    });
}
exports.getAwsProfileList = getAwsProfileList;
/**
 * Get a specific _named profile_ in the AWS `credentials` file
 */
function getAwsProfile(profileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield getAwsProfileList(profileName);
        if (!profile) {
            throw new DevopsError_1.DevopsError(`Attempt to get the AWS profile "${profileName}" failed because the AWS credentials file does not exist!`, "devops/not-ready");
        }
        return profile;
    });
}
exports.getAwsProfile = getAwsProfile;
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

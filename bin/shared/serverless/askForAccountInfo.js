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
const npm_1 = require("../npm");
const serverless_1 = require("../serverless");
const inquirer = require("inquirer");
const aws_1 = require("../aws");
function askForAccountInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgJson = yield npm_1.getPackageJson();
        const defaults = (yield serverless_1.getAccountInfoFromServerlessYaml()) || {};
        const profiles = yield aws_1.getAwsProfileList();
        const profileMessage = "choose a profile from your AWS credentials file";
        const baseProfileQuestion = {
            name: "profile",
            message: "choose a profile from your AWS credentials file",
            default: defaults.profile,
            when: () => !defaults.profile
        };
        const profileQuestion = profiles
            ? Object.assign({}, baseProfileQuestion, {
                type: "list",
                choices: Object.keys(profiles)
            }) : Object.assign({}, baseProfileQuestion, { type: "input" });
        let questions = [
            {
                type: "input",
                name: "name",
                message: "what is the service name which your functions will be prefixed with",
                default: defaults.name || pkgJson.name,
                when: () => !defaults.name
            },
            profileQuestion
        ];
        let answers = yield inquirer.prompt(questions);
        const awsProfile = yield aws_1.getAwsProfile(answers.profile);
        const userProfile = awsProfile && awsProfile.aws_secret_access_key
            ? yield aws_1.getAwsUserProfile(awsProfile)
            : undefined;
        const accountId = userProfile
            ? userProfile.User.Arn.replace(/arn:aws:iam::([0-9]+):.*/, "$1")
            : undefined;
        questions = [
            {
                type: "input",
                name: "accountId",
                message: "what is the Amazon Account ID which you are deploying to?",
                default: accountId,
                when: () => !defaults.accountId
            },
            {
                type: "list",
                name: "region",
                message: "what is the region you will be deploying to?",
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
                ],
                default: defaults.region || awsProfile.region || "us-east-1",
                when: () => !defaults.region
            }
        ];
        answers = Object.assign({}, answers, (yield inquirer.prompt(questions)));
        return answers;
    });
}
exports.askForAccountInfo = askForAccountInfo;

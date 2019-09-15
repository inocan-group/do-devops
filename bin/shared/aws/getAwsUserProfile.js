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
const aws_sdk_1 = require("aws-sdk");
const getAwsProfile_1 = require("./getAwsProfile");
/**
 * Uses the AWS SDK to get the user's profile information.
 *
 * @param awsProfile you may pass in the _string_ name of the profile or the profile itself
 */
function getAwsUserProfile(awsProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof awsProfile === "string") {
            awsProfile = yield getAwsProfile_1.getAwsProfile(awsProfile);
        }
        const up = new aws_sdk_1.IAM({
            accessKeyId: awsProfile.aws_access_key_id,
            secretAccessKey: awsProfile.aws_secret_access_key
        })
            .getUser()
            .promise();
        return up;
    });
}
exports.getAwsUserProfile = getAwsUserProfile;

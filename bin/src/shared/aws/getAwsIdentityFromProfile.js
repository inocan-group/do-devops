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
exports.getAwsIdentityFromProfile = void 0;
const AWS = require("aws-sdk");
/**
 * Returns the `userId`, `accountId`, `arn`, and `user` when passed
 * the key/secret key found in a user's `~/.aws/credentials` file.
 *
 * @param profile a profile from a user's `credentials` file
 */
function getAwsIdentityFromProfile(profile) {
    return __awaiter(this, void 0, void 0, function* () {
        const sts = new AWS.STS({ accessKeyId: profile.aws_access_key_id, secretAccessKey: profile.aws_secret_access_key });
        const result = yield sts.getCallerIdentity().promise();
        return {
            userId: result.UserId,
            accountId: result.Account,
            arn: result.Arn,
            user: result.Arn.split(":").pop(),
        };
    });
}
exports.getAwsIdentityFromProfile = getAwsIdentityFromProfile;
// STS: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/STS.html
// getCallerIdentity: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/STS.html#getCallerIdentity-property

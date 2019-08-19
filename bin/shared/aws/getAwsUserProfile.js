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
const aws_sdk_1 = require("aws-sdk");
function getAwsUserProfile(awsProfile) {
    return __awaiter(this, void 0, void 0, function* () {
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

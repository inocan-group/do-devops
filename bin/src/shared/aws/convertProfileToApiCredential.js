"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertProfileToApiCredential = void 0;
const credentialMap = {
    aws_access_key_id: "accessKeyId",
    aws_secret_access_key: "secretAccessKey"
};
/**
 * converts the `IAwsProfile` format (which mimics what you have in the credentials file) and
 * converts it to something that resembles the AWS `CredentialsOptions` and can be used
 * directly in credentializing an API call
 */
function convertProfileToApiCredential(profile) {
    return Object.keys(profile).reduce((agg, key) => {
        if (key !== "region") {
            agg[credentialMap[key]] = profile[key];
        }
        return agg;
    }, {});
}
exports.convertProfileToApiCredential = convertProfileToApiCredential;

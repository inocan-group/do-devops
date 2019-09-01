"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const credentialMap = {
    aws_access_key_id: "accessKeyId",
    aws_secret_access_key: "secretAccessKey"
};
function convertProfileToApiCredential(profile) {
    return Object.keys(profile).reduce((agg, key) => {
        if (key !== "region") {
            agg[credentialMap[key]] = profile[key];
        }
        return agg;
    }, {});
}
exports.convertProfileToApiCredential = convertProfileToApiCredential;

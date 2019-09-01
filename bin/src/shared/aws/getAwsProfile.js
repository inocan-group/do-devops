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
const index_1 = require("./index");
const index_2 = require("../errors/index");
/**
 * Get a specific _named profile_ in the AWS `credentials` file;
 * throws `devops/not-ready` if error.
 */
function getAwsProfile(profileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield index_1.getAwsProfileList();
        if (!profile) {
            throw new index_2.DevopsError(`Attempt to get the AWS profile "${profileName}" failed because the AWS credentials file does not exist!`, "devops/not-ready");
        }
        if (!profile[profileName]) {
            throw new index_2.DevopsError(`The AWS profile "${profileName}" does not exist in the AWS credentials file! Valid profile names are: ${Object.keys(profile).join(", ")}`, "devops/not-ready");
        }
        return profile[profileName];
    });
}
exports.getAwsProfile = getAwsProfile;

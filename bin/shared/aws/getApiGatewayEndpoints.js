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
exports.getApiGatewayEndpoints = void 0;
const aws_sdk_1 = require("aws-sdk");
const index_1 = require("./index");
const userHasAwsProfile_1 = require("./userHasAwsProfile");
const chalk = require("chalk");
/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
function getApiGatewayEndpoints(profileName, region) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userHasAwsProfile_1.userHasAwsProfile(profileName)) {
            console.log(chalk `- attempt to get {italics endpoints} not possible with the profile {blue ${profileName}} as you do not have credentials defined for this profile! ${"\uD83D\uDE21" /* angry */}\n`);
            process.exit();
        }
        const profile = yield index_1.getAwsProfile(profileName);
        const credential = index_1.convertProfileToApiCredential(profile);
        const gw = new aws_sdk_1.APIGateway(Object.assign(Object.assign({}, credential), { region }));
        const apis = yield gw.getRestApis().promise();
        console.log(JSON.stringify(apis, null, 2));
        const detail = yield gw.getRestApi({ restApiId: apis.items[0].apiKeySource });
        return detail;
    });
}
exports.getApiGatewayEndpoints = getApiGatewayEndpoints;

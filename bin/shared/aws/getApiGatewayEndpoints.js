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
const serverless_1 = require("../serverless");
const index_1 = require("./index");
const index_2 = require("../serverless/index");
/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
function getApiGatewayEndpoints(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileName = yield index_2.determineProfile(opts);
        const profile = yield index_1.getAwsProfile(profileName);
        const region = yield serverless_1.determineRegion(opts);
        const gw = new aws_sdk_1.ApiGatewayV2({
            apiVersion: "2018-11-29",
            secretAccessKey: profile.aws_secret_access_key,
            accessKeyId: profile.aws_access_key_id
        });
        const result = yield gw.getApis().promise();
        return result.Items;
    });
}
exports.getApiGatewayEndpoints = getApiGatewayEndpoints;

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
const index_1 = require("./index");
/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
function getApiGatewayEndpoints(profileName, region) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = index_1.convertProfileToApiCredential(yield index_1.getAwsProfile(profileName));
        // const gw = new ApiGatewayV2({
        //   apiVersion: "2018-11-29",
        //   ...profile
        // });
        // const result = await gw.getApis().promise();
        const gw = new aws_sdk_1.APIGateway(Object.assign({}, profile));
        const result = yield gw.getRestApis().promise();
        console.log("result", result);
        return result.items;
    });
}
exports.getApiGatewayEndpoints = getApiGatewayEndpoints;

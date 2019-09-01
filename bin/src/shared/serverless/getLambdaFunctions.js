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
const determineRegion_1 = require("./determineRegion");
const aws_1 = require("../aws");
const _1 = require(".");
function getLambdaFunctions(opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const region = yield determineRegion_1.determineRegion(opts);
        const profileName = yield _1.getAwsProfileFromServerless();
        const profile = yield aws_1.getAwsProfile(profileName);
        const lambda = new aws_sdk_1.Lambda({
            apiVersion: "2015-03-31",
            region,
            secretAccessKey: profile.aws_secret_access_key,
            accessKeyId: profile.aws_access_key_id
        });
        const fns = yield lambda.listFunctions().promise();
        return fns.Functions;
    });
}
exports.getLambdaFunctions = getLambdaFunctions;

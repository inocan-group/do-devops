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
const determineRegion_1 = require("./determineRegion");
const aws_1 = require("../aws");
const determineProfile_1 = require("./determineProfile");
/**
 * Uses the AWS Lambda API to retrieve a list of functions for given
 * profile/region.
 */
function getLambdaFunctions(opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const region = yield determineRegion_1.determineRegion({ cliOptions: opts });
        const profileName = yield determineProfile_1.determineProfile({ cliOptions: opts });
        const profile = aws_1.convertProfileToApiCredential(yield aws_1.getAwsProfile(profileName));
        const lambda = new aws_sdk_1.Lambda(Object.assign({ apiVersion: "2015-03-31", region }, profile));
        const fns = yield lambda.listFunctions().promise();
        return fns.Functions;
    });
}
exports.getLambdaFunctions = getLambdaFunctions;

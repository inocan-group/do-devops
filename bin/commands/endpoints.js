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
const chalk = require("chalk");
const shared_1 = require("../shared");
const getApiGatewayEndpoints_1 = require("../shared/aws/getApiGatewayEndpoints");
exports.description = "Lists out all the endpoints defined in a given AWS profile/account.";
exports.options = [
    {
        name: "profile",
        type: String,
        typeLabel: "<profileName>",
        group: "endpoints",
        description: `set the AWS profile explicitly`,
    },
];
function handler(args, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileName = yield shared_1.determineProfile({ cliOptions: opts });
        const region = yield shared_1.determineRegion({ cliOptions: opts });
        try {
            console.log(chalk `- getting API {italic endpoints} for the profile {bold ${profileName}} [ ${region} ]`);
            // const endpoints = await getLambdaFunctions(opts);
            const endpoints = yield getApiGatewayEndpoints_1.getApiGatewayEndpoints(profileName, region);
            console.log(JSON.stringify(endpoints, null, 2));
        }
        catch (e) { }
    });
}
exports.handler = handler;

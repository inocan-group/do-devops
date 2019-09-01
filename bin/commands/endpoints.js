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
const getApiGatewayEndpoints_1 = require("../shared/aws/getApiGatewayEndpoints");
exports.description = "Lists out all the endpoints defined in a given AWS profile/account.";
function handler(args, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const endpoints = yield getApiGatewayEndpoints_1.getApiGatewayEndpoints({
                cliOptions: opts,
                interactive: true
            });
        }
        catch (e) { }
    });
}
exports.handler = handler;

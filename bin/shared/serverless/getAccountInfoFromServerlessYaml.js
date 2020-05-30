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
const getServerlessYaml_1 = require("./getServerlessYaml");
/**
 * Gets the `accountInfo` from the `serverless.yml` file if
 * possible. If not it returns nothing.
 */
function getAccountInfoFromServerlessYaml() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = yield getServerlessYaml_1.getServerlessYaml();
            const info = {
                name: typeof config.service === "string" ? config.service : config.service.name,
                accountId: config.custom.accountId,
                region: config.provider.region,
                profile: config.provider.profile,
                pluginsInstalled: config.plugins || [],
            };
            if (config.custom.logForwarding) {
                info.logForwarding = config.custom.logForwarding.destinationARN;
            }
            return info;
        }
        catch (e) {
            console.log(chalk `- Problems getting account info from {green serverless.yml}.`);
        }
    });
}
exports.getAccountInfoFromServerlessYaml = getAccountInfoFromServerlessYaml;

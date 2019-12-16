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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getServerlessYaml_1 = require("./getServerlessYaml");
const chalk_1 = __importDefault(require("chalk"));
/**
 * Gets the `accountInfo` from the `serverless.yml` file if
 * possible. If not it returns nothing.
 */
function getAccountInfoFromServerlessYaml() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = yield getServerlessYaml_1.getServerlessYaml();
            const info = {
                name: typeof config.service === "string"
                    ? config.service
                    : config.service.name,
                accountId: config.custom.accountId,
                region: config.provider.region,
                profile: config.provider.profile
            };
            if (config.custom.logForwarding) {
                info.logForwarding = config.custom.logForwarding.destinationARN;
            }
            try {
                const sls = yield getServerlessYaml_1.getServerlessYaml();
                info.pluginsInstalled = sls.plugins;
                if (!sls.plugins.includes("serverless-webpack")) {
                    console.log(chalk_1.default `{yellow {bold 
            - it is recommended that you use {blue webpack} in some form. }}
            - The most common means of doing this requires you install the {bold {blue serverless-webpack}} plugin}}
            - However, just installing {bold blue webpack}} will allow {italic {bold do-devops}} to build/tree-shake with webpack
          `);
                }
            }
            catch (e) {
                info.pluginsInstalled = [];
            }
            return info;
        }
        catch (e) {
            console.log(chalk_1.default `- Problems getting account info from {green serverless.yml}.`);
        }
    });
}
exports.getAccountInfoFromServerlessYaml = getAccountInfoFromServerlessYaml;

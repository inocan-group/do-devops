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
const getServerlessYaml_1 = require("./getServerlessYaml");
/**
 * Gets the `accountInfo` from the `serverless.yml` file if
 * possible. If not it returns nothing.
 */
function getAccountInfoFromServerlessYaml() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = yield getServerlessYaml_1.getServerlessYaml();
            return {
                name: config.provider.name,
                accountId: config.custom.accountId,
                region: config.provider.region,
                profile: config.provider.profile
            };
        }
        catch (e) {
            //
        }
    });
}
exports.getAccountInfoFromServerlessYaml = getAccountInfoFromServerlessYaml;

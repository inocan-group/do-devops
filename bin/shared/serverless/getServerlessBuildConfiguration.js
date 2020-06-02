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
exports.getServerlessBuildConfiguration = void 0;
const shared_1 = require("../../shared");
const typed_mapper_1 = require("typed-mapper");
/**
 * Will find the appropriate configuration information
 * for the serverless build process. Looking either in
 * the `serverless-config/account-info.yml` (deprecated)
 * or pulled from the Yeoman templates's `.yo-rc.json` file.
 *
 * If the info is not found in either location then it
 * will switch to interactive mode to get the data it
 * needs.
 */
function getServerlessBuildConfiguration() {
    return __awaiter(this, void 0, void 0, function* () {
        const modern = shared_1.getYeomanScaffolds().includes("generator-lambda-typescript");
        const knownAccountInfo = Object.assign(Object.assign({}, (modern ? transformYeomanFormat(yield shared_1.getYeomanConfig()) : yield shared_1.getAccountInfoFromServerlessYaml())), { devDependencies: Object.keys(shared_1.getPackageJson().devDependencies), pluginsInstalled: Object.keys(shared_1.getPackageJson().devDependencies).filter((i) => i.startsWith("serverless-")) });
        const accountInfo = yield shared_1.askForAccountInfo(knownAccountInfo);
        return accountInfo;
    });
}
exports.getServerlessBuildConfiguration = getServerlessBuildConfiguration;
function transformYeomanFormat(input) {
    return typed_mapper_1.default.map({
        name: "serviceName",
        accountId: "awsAccount",
        profile: "awsProfile",
        region: "awsRegion",
        devDependencies: () => [],
        pluginsInstalled: () => [],
    }).convertObject(input);
}

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
exports.isServerless = void 0;
const fs = require("fs");
const path = require("path");
const npm_1 = require("../npm");
const getServerlessYaml_1 = require("./getServerlessYaml");
/**
 * returns a set of flags indicating whether it appears the serverless framework
 * is being used in this repo
 */
function isServerless() {
    return __awaiter(this, void 0, void 0, function* () {
        const hasServerlessConfig = fs.existsSync(path.join(process.cwd(), "serverless.yml"));
        let slsConfig;
        try {
            slsConfig = yield getServerlessYaml_1.getServerlessYaml();
        }
        catch (e) {
            //
        }
        const pkgJson = npm_1.getPackageJson();
        const hasAsDevDep = pkgJson ? Object.keys(pkgJson.devDependencies).includes("serverless") : false;
        const isUsingTypescriptMicroserviceTemplate = fs.existsSync(path.join(process.cwd(), "serverless-config/config.ts"));
        const hasProviderSection = slsConfig && slsConfig.provider ? true : false;
        const configIsParsable = hasServerlessConfig && slsConfig ? true : false;
        return hasServerlessConfig || hasAsDevDep || isUsingTypescriptMicroserviceTemplate
            ? {
                hasServerlessConfig,
                hasAsDevDep,
                isUsingTypescriptMicroserviceTemplate,
                hasProviderSection,
                configIsParsable,
            }
            : false;
    });
}
exports.isServerless = isServerless;

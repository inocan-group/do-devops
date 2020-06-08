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
exports.getMicroserviceConfig = void 0;
const chalk = require("chalk");
const path = require("path");
const errors_1 = require("../errors");
const async_shelljs_1 = require("async-shelljs");
/**
 * Gets the typescript configuration file for serverless
 * projects which use the `typescript-microservice` yeoman
 * template and generates a `serverless.yml` file from it.
 */
function getMicroserviceConfig(accountInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const cliFile = path.join(process.env.PWD, "serverless-config", "build.ts");
        try {
            const config = yield async_shelljs_1.asyncExec(`yarn ts-node ${cliFile} '${JSON.stringify(accountInfo)}'`, { silent: true });
            return config;
        }
        catch (e) {
            console.log(chalk `{yellow - failed executing ${cliFile}}`);
            throw new errors_1.DevopsError(`Problem getting the microservice config file [ ${cliFile} ]: ${e.message}`, "devops/missing-config");
        }
    });
}
exports.getMicroserviceConfig = getMicroserviceConfig;

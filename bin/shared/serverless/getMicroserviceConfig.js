"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const errors_1 = require("../errors");
const async_shelljs_1 = require("async-shelljs");
const chalk_1 = __importDefault(require("chalk"));
/**
 * Gets the typescript configuration file for serverless
 * projects which use the `typescript-microservice` yeoman
 * template and generates a `serverless.yml` file from it.
 */
function getMicroserviceConfig(accountInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const cliFile = path_1.default.join(process.env.PWD, "serverless-config", "build.ts");
        try {
            const config = yield async_shelljs_1.asyncExec(`yarn ts-node ${cliFile} '${JSON.stringify(accountInfo)}'`, { silent: true });
            return config;
        }
        catch (e) {
            console.log(chalk_1.default `{yellow - failed executing ${cliFile}}`);
            throw new errors_1.DevopsError(`Problem getting the microservice config file [ ${cliFile} ]: ${e.message}`, "devops/missing-config");
        }
    });
}
exports.getMicroserviceConfig = getMicroserviceConfig;

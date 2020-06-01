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
exports.buildServerlessMicroserviceProject = void 0;
const chalk = require("chalk");
const os = require("os");
const index_1 = require("../index");
const async_shelljs_1 = require("async-shelljs");
const file_1 = require("../../file");
const createFunctionEnum_1 = require("./createFunctionEnum");
const index_2 = require("./index");
const createWebpackEntryDictionaries_1 = require("./createWebpackEntryDictionaries");
const getLocalHandlerInfo_1 = require("../getLocalHandlerInfo");
const npm_1 = require("../../npm");
const ACCOUNT_INFO_YAML = "./serverless-config/account-info.yml";
/**
 * Builds a `serverless.yml` file from the configuration
 * available in the `/serverless-config` directory.
 *
 * The key requirement here is that the `accountInfo` hash is
 * built out. This information will be gathered from the
 * following sources (in this order):
 *
 * 1. look within the `serverless.yml` for info (if it exists)
 * 2. ask the user for the information (saving values as default for next time)
 */
function buildServerlessMicroserviceProject(opts = {}, config = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let stage = "starting";
        const devDependencies = Object.keys(npm_1.getPackageJson().devDependencies);
        const knownAccountInfo = Object.assign(Object.assign({}, (yield index_1.getAccountInfoFromServerlessYaml())), { devDependencies });
        const accountInfo = yield index_1.askForAccountInfo(knownAccountInfo);
        file_1.saveYamlFile(ACCOUNT_INFO_YAML, accountInfo);
        const hasWebpackPlugin = devDependencies.includes("serverless-webpack");
        console.log(chalk `- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered`);
        const handlerInfo = getLocalHandlerInfo_1.getLocalHandlerInfo();
        console.log(chalk `{grey - handler functions [ {bold ${String(handlerInfo.length)}} ] have been identified}`);
        yield index_2.createInlineExports(handlerInfo);
        console.log(chalk `{grey - The inline function configuration file [ {bold {italic serverless-config/functions/inline.ts}} ] has been configured}`);
        yield createFunctionEnum_1.createFunctionEnum(handlerInfo);
        console.log(chalk `{grey - The enumeration and type [ {bold {italic src/@types/functions.ts}} ] for the available functions has been configured }`);
        if (!hasWebpackPlugin) {
            yield createWebpackEntryDictionaries_1.createWebpackEntryDictionaries(handlerInfo.map((i) => i.source));
            console.log(chalk `{grey - added webpack {italic entry files} to facilitate code build and watch operations}`);
        }
        else {
            const exist = file_1.filesExist("webpack.js-entry-points.json", "webpack.js-entry-points.json");
            if (exist) {
                async_shelljs_1.rm(...exist);
                console.log(chalk `- ${"\uD83D\uDC40" /* eyeballs */} removed webpack entry point files so as not to confuse with what the {italic serverless-webpack} plugin is doing}`);
            }
        }
        console.log(chalk `- handing off the build of the {green {bold serverless.yml}} to the repo's {bold build} script\n`);
        yield async_shelljs_1.asyncExec(`yarn ts-node serverless-config/build.ts --color=always`, {
            env: Object.assign(Object.assign(Object.assign({}, process.env), { TERM: "xterm-color" }), (os.platform().includes("win") ? {} : { shell: "/bin/bash" })),
        });
        async_shelljs_1.rm(ACCOUNT_INFO_YAML);
        console.log(chalk `{grey - removed the temporary {blue account-info.yml} file from the repo}`);
        console.log(chalk `{green - {bold serverless.yml} has been updated successfully ${"\uD83D\uDE80" /* rocket */}}\n`);
    });
}
exports.buildServerlessMicroserviceProject = buildServerlessMicroserviceProject;

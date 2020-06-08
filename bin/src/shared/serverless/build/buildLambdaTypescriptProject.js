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
exports.buildLambdaTypescriptProject = void 0;
const chalk = require("chalk");
const os = require("os");
const async_shelljs_1 = require("async-shelljs");
const shared_1 = require("../../../shared");
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
function buildLambdaTypescriptProject(opts = {}, config = {}, 
/** modern scaffolding will pass in the config function to be managed here in this process */
configFn) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const modern = shared_1.getYeomanScaffolds().includes("generator-lambda-typescript");
        const accountInfo = yield shared_1.getServerlessBuildConfiguration();
        const hasWebpackPlugin = (_a = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.devDependencies) === null || _a === void 0 ? void 0 : _a.includes("serverless-webpack");
        const buildSystem = config.buildTool;
        // force transpilation
        if (opts.force) {
            // await serverlessTranspilation({ argv, opts, config, tooling, serverless });
        }
        if (!modern) {
            // temporarily lay down a config file
            shared_1.saveYamlFile(ACCOUNT_INFO_YAML, accountInfo);
        }
        console.log(chalk `- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered`);
        const handlerInfo = shared_1.getLocalHandlerInfo();
        console.log(chalk `{grey - handler functions [ {bold ${String(handlerInfo.length)}} ] have been identified}`);
        yield shared_1.createInlineExports(handlerInfo);
        console.log(chalk `{grey - The inline function configuration file [ {bold {italic serverless-config/functions/inline.ts}} ] has been configured}`);
        yield shared_1.createFunctionEnum(handlerInfo);
        console.log(chalk `{grey - The enumeration and type [ {bold {italic src/@types/functions.ts}} ] for the available functions has been configured }`);
        if (!hasWebpackPlugin) {
            // the preferred means of bundling using webpack
            yield shared_1.createWebpackEntryDictionaries(handlerInfo.map((i) => i.source));
            console.log(chalk `{grey - added webpack {italic entry files} to facilitate code build and watch operations}`);
        }
        else {
            const exist = shared_1.filesExist("webpack.js-entry-points.json", "webpack.js-entry-points.json");
            if (exist) {
                async_shelljs_1.rm(...exist);
                console.log(chalk `- ${"\uD83D\uDC40" /* eyeballs */} removed webpack entry point files so as not to confuse with what the {italic serverless-webpack} plugin is doing}`);
            }
        }
        if (modern && configFn) {
            const serverless = configFn(accountInfo);
            yield shared_1.saveToServerlessYaml(serverless);
        }
        else {
            console.log(chalk `- handing off the build of the {green {bold serverless.yml}} to the repo's {bold build} script\n`);
            yield async_shelljs_1.asyncExec(`yarn ts-node serverless-config/build.ts --color=always`, {
                env: Object.assign(Object.assign(Object.assign({}, process.env), { TERM: "xterm-color" }), (os.platform().includes("win") ? {} : { shell: "/bin/bash" })),
            });
            async_shelljs_1.rm(ACCOUNT_INFO_YAML);
            console.log(chalk `{grey - removed the temporary {blue account-info.yml} file from the repo}`);
        }
        console.log(chalk `{green - {bold serverless.yml} has been updated successfully ${"\uD83D\uDE80" /* rocket */}}\n`);
    });
}
exports.buildLambdaTypescriptProject = buildLambdaTypescriptProject;

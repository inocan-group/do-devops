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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("./build-helpers/index");
exports.defaultConfig = {
    preBuildHooks: ["clean"],
    targetDirectory: "dist",
    buildTool: "tsc"
};
function description() {
    return `Efficient and clear build pipelines for serverless and/or NPM libraries`;
}
exports.description = description;
function handler(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { build: config } = yield shared_1.getConfig();
        const serverlessProject = yield shared_1.isServerless();
        const buildTool = opts.buildTool ||
            config.buildTool ||
            (yield index_1.askBuildTool(serverlessProject ? true : false));
        const hasWebpackPlugin = Object.keys(shared_1.getPackageJson().devDependencies).includes("serverless-webpack");
        yield index_1.saveToolToRepoConfig(buildTool);
        if (serverlessProject) {
            yield shared_1.buildServerlessMicroserviceProject();
            if (config.buildTool === "webpack") {
                if (opts.force) {
                    const buildTool = yield Promise.resolve().then(() => __importStar(require(`./build-helpers/tools/${config.buildTool}`)));
                }
                else {
                    if (hasWebpackPlugin) {
                        console.log(chalk_1.default `{grey - {bold Note:} you're configured to use {bold Webpack} as your code build tool and have the {italic serverless-webpack} plugin so use of Webpack will happen at deploy time. }`);
                    }
                    else {
                        console.log(chalk_1.default `{grey - {bold Note:} you're configured to use {bold Webpack} as your code build tool and do not appear to be
  using the {italic serverless-webpack} plugin. This is entirely fine but code will not be
  transpiled with the {italic build} command unless you include the {blue --force} switch.}`);
                        console.log(chalk_1.default `\n{grey - {bold Note:} for most people using this config, {blue yarn do watch} will be the most efficient way
  to ensure that you always have transpiled code when you {italic deploy}. If you do not then 
  the {italic deploy} command will detect this and transpile at deploy-time.}`);
                    }
                }
            }
        }
        else {
            if (config.buildTool) {
                if (hasWebpackPlugin) {
                    console.log(chalk_1.default `- You are configured to use the {bold ${config.buildTool}} but you {italic also} have the {italic serverless-webpack} plugin. This is probably a mistake! ${"\uD83D\uDE32" /* shocked */}`);
                }
                const buildTool = yield Promise.resolve().then(() => __importStar(require(`./build-helpers/tools/${config.buildTool}`)));
                yield buildTool.build(config, opts);
            }
            else {
                throw new Error("There was no build tool configured for this repo!");
            }
        }
        console.log(chalk_1.default `\n- {bold build} complete ${"\uD83C\uDF89" /* party */}\n`);
    });
}
exports.handler = handler;

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
const ast_1 = require("../shared/ast");
exports.defaultConfig = {
    preBuildHooks: ["clean"],
    targetDirectory: "dist",
    buildTool: "tsc"
};
exports.options = [
    {
        name: "force",
        type: Boolean,
        group: "build",
        description: `forces the transpiling of code when building a serverless project`
    },
    {
        name: "interactive",
        alias: "i",
        type: Boolean,
        group: "build",
        description: `allows choosing the functions interactively`
    }
];
function description() {
    return `Efficient and clear build pipelines for serverless and/or NPM libraries`;
}
exports.description = description;
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { build: config } = yield shared_1.getConfig();
        const serverless = yield shared_1.isServerless();
        const buildTool = opts.buildTool ||
            config.buildTool ||
            (yield index_1.askBuildTool(serverless ? true : false));
        const tooling = (yield Promise.resolve().then(() => __importStar(require(`./build-helpers/tools/${buildTool}`))))
            .default;
        if (opts.output && !opts.quiet) {
            console.log(chalk_1.default `{red - the "--output" option is a general option but has no meaning for the {bold build} command} ${"\uD83D\uDE21" /* angry */}. The build will continue, ignoring this flag.`);
        }
        if (serverless) {
            yield index_1.serverlessTranspilation({ argv, opts, config, tooling, serverless });
            yield shared_1.buildServerlessMicroserviceProject(opts, config);
        }
        else {
            const fns = argv.length > 0 ? argv : ast_1.getValidServerlessHandlers();
            yield tooling({ fns, opts });
        }
        console.log(chalk_1.default `\n- {bold build} complete ${"\uD83C\uDF89" /* party */}\n`);
    });
}
exports.handler = handler;

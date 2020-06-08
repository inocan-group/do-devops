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
exports.handler = exports.description = exports.options = exports.defaultConfig = void 0;
const chalk = require("chalk");
const shared_1 = require("../shared");
const index_1 = require("./build-helpers/index");
const ast_1 = require("../shared/ast");
exports.defaultConfig = {
    preBuildHooks: ["clean"],
    targetDirectory: "dist",
    buildTool: "tsc",
};
exports.options = [
    {
        name: "force",
        type: Boolean,
        group: "build",
        description: `forces the transpiling of code when building a serverless project`,
    },
    {
        name: "interactive",
        alias: "i",
        type: Boolean,
        group: "build",
        description: `allows choosing the functions interactively`,
    },
];
function description() {
    return `Efficient and clear build pipelines for serverless and/or NPM libraries`;
}
exports.description = description;
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { build: config } = yield shared_1.getConfig();
        const serverless = yield shared_1.isServerless();
        const buildTool = opts.buildTool || config.buildTool || (yield index_1.askBuildTool(serverless ? true : false));
        const tooling = (yield Promise.resolve().then(() => require(`./build-helpers/tools/${buildTool}`)))
            .default;
        if (opts.output && !opts.quiet) {
            console.log(chalk `{red - the "--output" option is a general option but has no meaning for the {bold build} command} ${"\uD83D\uDE21" /* angry */}. The build will continue, ignoring this flag.`);
        }
        if (serverless) {
            console.log(chalk `{bold {yellow - Starting SERVERLESS build process}}\n`);
            yield shared_1.buildLambdaTypescriptProject(opts, config);
        }
        else {
            console.log(chalk `{bold {yellow - Starting code build process; using ${buildTool}}}`);
            const fns = argv.length > 0 ? argv : ast_1.getValidServerlessHandlers();
            yield tooling({ fns, opts });
        }
        console.log(chalk `\n- {bold build} complete ${"\uD83C\uDF89" /* party */}\n`);
    });
}
exports.handler = handler;

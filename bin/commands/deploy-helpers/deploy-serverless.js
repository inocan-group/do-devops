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
const async_shelljs_1 = require("async-shelljs");
const chalk_1 = __importDefault(require("chalk"));
const sandbox_1 = require("../../shared/sandbox");
const shared_1 = require("../../shared");
const index_1 = require("./index");
const index_2 = require("../../shared/serverless/build/index");
/**
 * Manages the execution of a serverless deployment
 */
function serverlessDeploy(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const stage = yield shared_1.determineStage(opts);
        const { deploy: config } = yield shared_1.getConfig();
        console.log(argv, opts, stage);
        const meta = { stage, config: config, opts };
        // argv values indicate function deployment
        if (argv.length > 0) {
            yield functionDeploy(argv, meta);
        }
        else {
            yield fullDeploy(meta);
        }
    });
}
exports.default = serverlessDeploy;
function functionDeploy(fns, meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stage, opts, config } = meta;
        console.log(chalk_1.default `- {bold serverless} deployment for {bold ${String(fns.length)}} functions to {italic ${stage}} stage ${"\uD83C\uDF89" /* party */}`);
        const transpile = index_1.isTranspileNeeded(meta);
        if (transpile.length > 0) {
            const build = (yield Promise.resolve().then(() => __importStar(require("../build-helpers/tools/webpack")))).default({
                opts: { fns: transpile }
            }).build;
            yield build();
        }
        console.log(chalk_1.default `{grey - zipping up ${String(fns.length)} {bold Serverless} {italic handler} functions }`);
        yield index_2.zipWebpackFiles(fns);
        console.log(chalk_1.default `{grey - all handlers zipped; ready for deployment ${"\uD83D\uDC4D" /* thumbsUp */}}`);
        console.log(chalk_1.default `- deploying {bold ${String(fns.length)} functions} to "${stage}" stage`);
        const sandboxStage = stage === "dev" ? yield sandbox_1.sandbox(stage) : stage;
        if (sandboxStage !== stage) {
        }
        fns.forEach(fn => console.log(chalk_1.default.grey(`    - ${fn}`)));
        const promises = [];
        try {
            fns.map(fn => {
                promises.push(async_shelljs_1.asyncExec(`sls deploy function --force --aws-s3-accelerate --function ${fn} --stage ${stage}`));
            });
            yield Promise.all(promises);
            console.log(chalk_1.default `\n- all {bold ${String(fns.length)}} function(s) were deployed! ${"\uD83D\uDE80" /* rocket */}\n`);
        }
        catch (e) {
            console.log(chalk_1.default `- {red {bold problems deploying functions!}} ${"\uD83D\uDCA9" /* poop */}`);
            console.log(`- ${e.message}`);
            console.log(chalk_1.default `- {dim ${e.stack}}`);
        }
    });
}
function fullDeploy(meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stage, opts, config } = meta;
        console.log(chalk_1.default `- Starting {bold FULL serverless} deployment for {italic ${stage}} stage`);
        if (!shared_1.hasDevDependency("serverless-webpack")) {
            console.log(chalk_1.default `{grey - checking timestamps to determine what {bold webpack} transpilation is needed}`);
            const transpile = index_1.isTranspileNeeded(meta);
            if (transpile.length > 0) {
                const build = (yield Promise.resolve().then(() => __importStar(require("../build-helpers/tools/webpack")))).default({
                    opts: { fns: transpile }
                }).build;
                yield build();
            }
            const fns = shared_1.getLocalHandlerInfo().map(i => i.fn);
            console.log(chalk_1.default `{grey - zipping up all ${String(fns.length)} Serverless handlers}`);
            yield index_2.zipWebpackFiles(fns);
            console.log(chalk_1.default `{grey - all handlers zipped; ready for deployment ${"\uD83D\uDC4D" /* thumbsUp */}}`);
        }
        if (config.showUnderlyingCommands) {
            console.log(chalk_1.default `{grey > {italic sls deploy --aws-s3-accelerate  --stage ${stage} --verbose}}\n`);
            try {
                yield async_shelljs_1.asyncExec(`sls deploy --aws-s3-accelerate  --stage ${stage} --verbose`);
                console.log(chalk_1.default `\n- The full deploy was successful! ${"\uD83D\uDE80" /* rocket */}\n`);
            }
            catch (e) {
                console.log(chalk_1.default `- {red Error running deploy!}`);
                console.log(chalk_1.default `- NOTE: {dim if the error appears related to running out of heap memory then you can try {bold {yellow export NODE_OPTIONS=--max_old_space_size=4096}}}\n`);
            }
        }
    });
}

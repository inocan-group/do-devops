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
const async_shelljs_1 = require("async-shelljs");
const chalk_1 = __importDefault(require("chalk"));
const sandbox_1 = require("../../shared/sandbox");
const shared_1 = require("../../shared");
/**
 * Manages the execution of a serverless deployment
 */
function serverlessDeploy(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const stage = yield shared_1.getStage(opts);
        const { deploy: config } = yield shared_1.getConfig();
        const meta = { stage, config: config, opts };
        console.log(chalk_1.default `- {bold serverless} deployment starting for {italic ${stage}} stage ${"\uD83C\uDF89" /* party */}`);
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
        console.log(chalk_1.default `- deploying {bold ${String(fns.length)} functions} to "${stage}" stage`);
        const sandboxStage = stage === "dev" ? yield sandbox_1.sandbox(stage) : stage;
        if (sandboxStage !== stage) {
        }
        fns.forEach(fn => console.log(chalk_1.default.grey(`    - ${fn}`)));
        const promises = [];
        fns.map(fn => {
            promises.push(async_shelljs_1.asyncExec(`sls deploy function --force --aws-s3-accelerate --function ${fn} --stage ${stage}`));
        });
        yield Promise.all(promises);
    });
}
function fullDeploy(meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stage, opts, config } = meta;
        console.log(chalk_1.default `- deploying {bold all} functions to {bold ${stage}} stage`);
    });
}
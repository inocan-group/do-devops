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
/**
 * Manages the execution of a serverless deployment
 */
function serverlessDeploy(deploy, global) {
    return __awaiter(this, void 0, void 0, function* () {
        //
    });
}
exports.default = serverlessDeploy;
function functionDeploy(fns, stage, config) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`- deploying ${fns.length} functions to "${stage}" stage: `);
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
function fullDeploy(stage) {
    return __awaiter(this, void 0, void 0, function* () {
        // await asyncExec();
    });
}

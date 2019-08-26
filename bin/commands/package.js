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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const deploy_helpers_1 = require("./deploy-helpers");
const chalk_1 = __importDefault(require("chalk"));
function description(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return chalk_1.default `Package up resources for {bold Serverless} publishing but do not actually {italic deploy}.`;
    });
}
exports.description = description;
exports.syntax = "do package <options>";
function options(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deploy: config } = yield shared_1.getConfig();
        const target = opts.target || config.target;
        return [
            {
                name: "interactive",
                alias: "i",
                type: Boolean,
                group: "serverlessDeploy",
                description: `allow interactive choices for the functions you want to deploy`
            },
            {
                name: "target",
                alias: "t",
                typeLabel: "<target>",
                type: String,
                group: "deploy",
                description: "manually override the project target (serverless, npm)"
            }
        ];
    });
}
exports.options = options;
/**
 * **Package Handler**
 *
 * The `package` command is used in **Serverless** projects to build all of
 * the _deployable_ assets but without actually deploying.
 */
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const detect = yield deploy_helpers_1.detectTarget();
        const target = detect.target;
        if (!target) {
            console.log(`  - ${"\uD83D\uDCA9" /* poop */} You must state a valid "target" [ ${target ? target + "{italic not valid}" : "no target stated"} ]`);
        }
        // await runHooks(deploy.preDeployHooks);
        const helper = (yield Promise.resolve().then(() => __importStar(require(`./deploy-helpers/deploy-${target}`)))).default;
        yield helper(argv, opts);
    });
}
exports.handler = handler;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
exports.defaultConfig = {
    preDeployHooks: ["clean"],
    target: "serverless",
    showUnderlyingCommands: true,
    sandboxing: "user"
};
function description(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const base = `Deployment services that for {bold Serverless} or {bold NPM} publishing.\n\n`;
        const { deploy: config } = yield shared_1.getConfig();
        const detect = yield deploy_helpers_1.detectTarget();
        const possibleTargets = {
            serverless: `This project was detected to be a {bold Serverless} project. Unless you state explicitly that you want to use {bold NPM} targetting it will use Serverless.`,
            npm: `This project was detected to be a {bold NPM} project. Unless you state explicitly that you want to use "serverless" targetting it will use NPM. `,
            both: `This project was detected to have both {bold Serverless} functions {italic and} be an {bold NPM} library. By default the deploy command will assume you want to use {bold Serverless} deployment but the {italic options} listed below allow for both targets.`,
            bespoke: "not implemented yet"
        };
        return base + possibleTargets[detect.target];
    });
}
exports.description = description;
exports.syntax = "do deploy [fn1] [fn2] <options>\n\n{dim Note: {italic stating particular functions is {italic optional} and if excluded will result in a full deployment of all functions.}}";
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
 * **Deploy Handler**
 *
 * The _deploy_ command is used when you want to push your changes
 * to an environment where they will be used. This can mean different
 * things based on context and this handler will support the following
 * deployment scenarios:
 *
 * 1. Deploy to `npm` (aka, publish)
 * 2. Deploy to a serverless environment by leveraging the **Serverless** framework
 *
 * Over time we may add other targets for deployment.
 */
function handler(argv, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deploy, global } = yield shared_1.getConfig();
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

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
const chalk = require("chalk");
const index_1 = require("./index");
const npm_1 = require("../npm");
const inquirer = require("inquirer");
/**
 * Checks whether the existing configuration has `logForwarding`
 * turned on in the **custom** section. If it _does_ then it just
 * logs a message about that, if it doesn't then it drops into
 * interactive mode if the `serverless-log-forwarding` is installed
 * as a **devDep**.
 */
function askAboutLogForwarding(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasServerlessLogForwarding = yield npm_1.hasDevDependency("serverless-log-forwarding");
        const hasConfigInfoForForwarding = config.custom.logForwarding ? true : false;
        if (!hasServerlessLogForwarding) {
            if (hasConfigInfoForForwarding) {
                console.log(chalk `{red - detected a {bold {blue logForwarding}} section in your serverless configuration but you do {italic not} have the {italic {blue serverless-log-forwarding}} plugin installed as a {bold devDep}.}`);
            }
            else {
                console.log(chalk `{dim - you are {italic not} using the {blue serverless-log-forwarding} plugin so skipping config for log forwarding}`);
            }
            return config;
        }
        if (hasConfigInfoForForwarding) {
            console.log(chalk `{grey - the {blue serverless-log-forwarding} is configured [ ${config.custom.logForwarding.destinationARN} ]}`);
            return config;
        }
        console.log(chalk `- you have installed the {blue {italic serverless-log-forwarding}} plugin but have not configured it.`);
        let Action;
        (function (Action) {
            Action["now"] = "configure now";
            Action["remove"] = "remove \"serverless-log-forwarding\" from package.json";
            Action["later"] = "do this later";
        })(Action || (Action = {}));
        let answers;
        let questions = [
            {
                type: "list",
                name: "action",
                message: chalk `{bold choose from one of the {italic actions} below:}`,
                choices: [Action.now, Action.remove, Action.later],
                default: Action.now,
                when: () => true,
            },
        ];
        answers = (yield inquirer.prompt(questions));
        if (answers.action === Action.now) {
            const awsFunctions = yield index_1.getLambdaFunctions();
            const stage = (yield index_1.determineStage({})) || "dev";
            const fns = awsFunctions.map((i) => i.FunctionName).concat("CANCEL");
            const defaultFn = fns.filter((i) => i.toLocaleLowerCase().includes("shipper")).find((i) => i.includes(stage));
            questions = [
                {
                    type: "list",
                    name: "shipper",
                    message: 'Which function will serve as your "shipper function"?',
                    choices: fns,
                    default: defaultFn || fns[0],
                    when: () => true,
                },
            ];
            answers = Object.assign(Object.assign({}, answers), (yield inquirer.prompt(questions)));
            if (answers.shipper !== "CANCEL") {
                const arn = awsFunctions.find((i) => i.FunctionName === answers.shipper).FunctionArn;
                config.custom.logForwarding = { destinationARN: arn };
            }
            else {
                console.log(chalk `{grey - ok, cancelling the config of a shipping function for now}`);
            }
        }
        else if (answers.action === Action.remove) {
            const pkg = yield npm_1.getPackageJson();
            pkg.devDependencies = Object.keys(pkg.devDependencies).reduce((agg, key) => {
                if (key !== "serverless-log-forwarding") {
                    agg[key] = pkg.devDependencies[key];
                }
                return agg;
            }, {});
            yield npm_1.writePackageJson(pkg);
        }
        else {
            // nothing to do
        }
        return config;
    });
}
exports.askAboutLogForwarding = askAboutLogForwarding;

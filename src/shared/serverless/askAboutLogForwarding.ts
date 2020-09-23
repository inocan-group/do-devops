import chalk from "chalk";

import { IDictionary, IServerlessConfig } from "common-types";
import { determineStage, getLambdaFunctions } from "./index";
import { getPackageJson, hasDevDependency, writePackageJson } from "../npm";
import inquirer = require("inquirer");
/**
 * Checks whether the existing configuration has `logForwarding`
 * turned on in the **custom** section. If it _does_ then it just
 * logs a message about that, if it doesn't then it drops into
 * interactive mode if the `serverless-log-forwarding` is installed
 * as a **devDep**.
 */
export async function askAboutLogForwarding(config: IServerlessConfig) {
  const hasServerlessLogForwarding = await hasDevDependency("serverless-log-forwarding");
  const hasConfigInfoForForwarding = config.custom.logForwarding ? true : false;
  if (!hasServerlessLogForwarding) {
    if (hasConfigInfoForForwarding) {
      console.log(
        chalk`{red - detected a {bold {blue logForwarding}} section in your serverless configuration but you do {italic not} have the {italic {blue serverless-log-forwarding}} plugin installed as a {bold devDep}.}`
      );
    } else {
      console.log(
        chalk`{dim - you are {italic not} using the {blue serverless-log-forwarding} plugin so skipping config for log forwarding}`
      );
    }
    return config;
  }

  if (hasConfigInfoForForwarding) {
    console.log(
      chalk`{grey - the {blue serverless-log-forwarding} is configured [ ${config.custom.logForwarding.destinationARN} ]}`
    );
    return config;
  }

  console.log(
    chalk`- you have installed the {blue {italic serverless-log-forwarding}} plugin but have not configured it.`
  );

  enum Action {
    now = "configure now",
    remove = 'remove "serverless-log-forwarding" from package.json',
    later = "do this later",
  }
  let answers: {
    action: Action;
    shipper?: string;
  };

  let questions: Array<inquirer.Question | inquirer.ListQuestion> = [
    {
      type: "list",
      name: "action",
      message: chalk`{bold choose from one of the {italic actions} below:}`,
      choices: [Action.now, Action.remove, Action.later],
      default: Action.now,
      when: () => true,
    },
  ];

  answers = (await inquirer.prompt(questions)) as { action: Action };

  if (answers.action === Action.now) {
    const awsFunctions = await getLambdaFunctions();
    const stage = (await determineStage({})) || "dev";
    const fns = awsFunctions.map((i) => i.FunctionName).concat("CANCEL");
    const defaultFn = fns
      .filter((i) => i.toLocaleLowerCase().includes("shipper"))
      .find((i) => i.includes(stage));
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
    answers = { ...answers, ...(await inquirer.prompt(questions)) };
    if (answers.shipper !== "CANCEL") {
      const arn = awsFunctions.find((i) => i.FunctionName === answers.shipper).FunctionArn;
      config.custom.logForwarding = { destinationARN: arn };
    } else {
      console.log(chalk`{grey - ok, cancelling the config of a shipping function for now}`);
    }
  } else if (answers.action === Action.remove) {
    const pkg = await getPackageJson();
    pkg.devDependencies = Object.keys(pkg.devDependencies).reduce((agg, key: string) => {
      if (key !== "serverless-log-forwarding") {
        agg[key] = pkg.devDependencies[key];
      }
      return agg;
    }, {} as IDictionary<string>);
    await writePackageJson(pkg);
  } else {
    // nothing to do
  }

  return config;
}

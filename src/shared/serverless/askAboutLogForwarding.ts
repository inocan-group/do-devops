/* eslint-disable quotes */
import chalk from "chalk";

import { arn, IDictionary, IServerlessYaml } from "common-types";
import { getLambdaFunctions } from "./index";
import { determineStage } from "src/shared/observations";
import { getPackageJson, hasDevDependency, savePackageJson } from "../npm";
import inquirer, { ListQuestion, Question } from "inquirer";

import { DevopsError } from "src/errors";
/**
 * Checks whether the existing configuration has `logForwarding`
 * turned on in the **custom** section. If it _does_ then it just
 * logs a message about that, if it doesn't then it drops into
 * interactive mode if the `serverless-log-forwarding` is installed
 * as a **devDep**.
 */
export async function askAboutLogForwarding(config: IServerlessYaml) {
  const hasServerlessLogForwarding = hasDevDependency("serverless-log-forwarding");
  const hasConfigInfoForForwarding = config?.custom?.logForwarding ? true : false;
  if (!hasServerlessLogForwarding) {
    if (hasConfigInfoForForwarding) {
      console.log(
        `{red - detected a ${chalk.bold.blue`logForwarding`} section in your serverless configuration but you do ${chalk.italic`not`} have the ${chalk.blue.italic`serverless-log-forwarding`} plugin installed as a ${chalk.bold`devDep`}.`
      );
    } else {
      console.log(
        chalk.dim`- you are ${chalk.italic`not`} using the ${chalk.blue`serverless-log-forwarding`} plugin so skipping config for log forwarding`
      );
    }
    return config;
  }

  if (hasConfigInfoForForwarding) {
    console.log(
      chalk.gray`- the ${chalk.blue`serverless-log-forwarding`} is configured [ ${config?.custom?.logForwarding?.destinationARN} ]`
    );
    return config;
  }

  console.log(
    `- you have installed the ${chalk.blue.italic`serverless-log-forwarding`} plugin but have not configured it.`
  );

  enum Action {
    now = "configure now",
    remove = 'remove "serverless-log-forwarding" from package.json',
    later = "dd this later",
  }
  let answers: {
    action: Action;
    shipper?: string;
  };

  let questions: Array<Question | ListQuestion> = [
    {
      type: "list",
      name: "action",
      message: `${chalk.bold`choose from one of the ${chalk.italic`actions`} below:`}`,
      choices: [Action.now, Action.remove, Action.later],
      default: Action.now,
      when: () => true,
    },
  ];

  answers = (await inquirer.prompt(questions)) as { action: Action };

  if (answers.action === Action.now) {
    const awsFunctions = await getLambdaFunctions();
    const stage = (await determineStage({})) || "dev";
    const fns: string[] = [...awsFunctions.map((i) => i.FunctionName as string), "CANCEL"];
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
    if (answers.shipper && answers.shipper !== "CANCEL") {
      const arn = awsFunctions.find((i) => i.FunctionName === answers.shipper)?.FunctionArn as arn;
      if (!config.custom) {
        config.custom = {};
      }
      config.custom.logForwarding = { destinationARN: arn };
    } else {
      console.log(chalk.gray`- ok, cancelling the config of a shipping function for now`);
    }
  } else if (answers.action === Action.remove) {
    const pkg = getPackageJson();
    if (!pkg) {
      throw new DevopsError(
        `No package.json file found while trying to query about log forwarding`,
        "not-ready/missing-package-json"
      );
    }
    pkg.devDependencies = Object.keys(pkg.devDependencies || {}).reduce((agg, key) => {
      if (key !== "serverless-log-forwarding") {
        agg[key] = (pkg.devDependencies || {})[key];
      }
      return agg;
    }, {} as IDictionary<string>);
    await savePackageJson(pkg);
  } else {
    // nothing to do
  }

  return config;
}

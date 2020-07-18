import commandLineArgs = require("command-line-args");
import { IDictionary } from "common-types";
import chalk = require("chalk");
import { isServerless, buildLambdaTypescriptProject } from "../../../shared";
import { subCommands } from "../private/index";
import { options } from "./index";

export interface ISubCommandHash {
  [cmd: string]: { execute: (argv: string[], opts: IDictionary) => Promise<void> };
}

export async function handler(argv: string[], ssmOptions: IDictionary) {
  const subCommand = argv.shift();
  const opts = commandLineArgs(options, {
    argv: argv,
    partial: true,
  });

  if (!Object.keys(subCommands).includes(subCommand)) {
    console.log(
      `- please choose a ${chalk.italic("valid")} ${chalk.bold.yellow("SSM")} sub-command: ${Object.keys(
        subCommands
      ).join(", ")}`
    );
    console.log();
    process.exit();
  }

  const serverless = await isServerless();
  if (serverless && serverless.isUsingTypescriptMicroserviceTemplate && !serverless.hasServerlessConfig) {
    await buildLambdaTypescriptProject();
  }

  try {
    await (subCommands as ISubCommandHash)[subCommand].execute(argv, ssmOptions);
  } catch (e) {
    console.log(chalk`{red - Ran into error when running "ssm ${subCommand}":}\n  - ${e.message}\n`);
    console.log(chalk`{grey - ${e.stack}}`);

    process.exit(1);
  }
}

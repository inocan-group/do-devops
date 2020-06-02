import * as chalk from "chalk";
import * as process from "process";

import { buildLambdaTypescriptProject, determineProfile, determineRegion, determineStage } from "../shared";

import { ICommandDescription } from "../@types/index";
import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
import { isServerless } from "../shared/serverless/isServerless";

import commandLineArgs = require("command-line-args");

/**
 * Description of command for help text
 */
export function description(...opts: any[]) {
  console.log("options", opts);

  return "allows an easy interaction with AWS's SSM parameter system for managing secrets.";
}

export const syntax = "do ssm <sub-command> <options>";
export const commands: ICommandDescription[] = [
  {
    name: "list",
    summary: "lists the SSM secrets for a given profile and region",
  },
  { name: "get", summary: "get details on a specific secret" },
  { name: "set", summary: "set the value for a given secret" },
];
export const examples = ["do ssm list", "do ssm list --profile myproject", "do ssm add DEV/TRELLO/SID abcdefg1234"];

export const options: OptionDefinition[] = [
  {
    name: "profile",
    type: String,
    typeLabel: "<profileName>",
    group: "ssm",
    description: `set the AWS profile explicitly`,
  },
  {
    name: "region",
    type: String,
    typeLabel: "<region>",
    group: "ssm",
    description: `set the AWS region explicitly`,
  },
  {
    name: "stage",
    type: String,
    typeLabel: "<stage>",
    group: "ssm",
    description: `set the stage explicitly`,
  },
  {
    name: "nonStandardPath",
    type: Boolean,
    group: "ssm",
    description: "allows the naming convention for SSM paths to be ignored for a given operation",
  },
];

export async function handler(argv: string[], ssmOptions: IDictionary) {
  const subCommand = argv[0];
  const opts = commandLineArgs(options, {
    argv: argv.slice(1),
    partial: true,
  });
  const subCmdOptions = {
    ...ssmOptions,
    ...opts.all,
    ...opts.ssm,
    params: opts._unknown,
  };

  const ssmCommands = ["list", "get", "set"];
  if (!ssmCommands.includes(subCommand)) {
    console.log(
      `- please choose a ${chalk.italic("valid")} ${chalk.bold.yellow("SSM")} sub-command: ${ssmCommands.join(", ")}`
    );
    console.log();
    process.exit();
  }

  const serverless = await isServerless();
  if (serverless && serverless.isUsingTypescriptMicroserviceTemplate && !serverless.hasServerlessConfig) {
    await buildLambdaTypescriptProject();
  }

  const profile = await determineProfile({
    cliOptions: subCmdOptions,
    interactive: true,
  });
  const region = await determineRegion({
    cliOptions: subCmdOptions,
    interactive: true,
  });
  const stage = await determineStage({ cliOptions: subCmdOptions.ssm });

  let importPath: string;

  switch (subCommand) {
    case "list":
      importPath = "./ssm/list";
      break;
    case "get":
      importPath = "./ssm/get";
      break;
    case "set":
      importPath = "./ssm/get";
      break;
  }

  const { execute } = (await import(importPath)) as {
    execute: (options: commandLineArgs.CommandLineOptions) => Promise<void>;
  };

  try {
    await execute({ ...subCmdOptions, profile, region, stage });
  } catch (e) {
    console.log(chalk`{red - Ran into error when running "ssm ${subCommand}":}\n  - ${e.message}\n`);
    console.log(chalk`{grey - ${e.stack}}`);

    process.exit(0);
  }
}

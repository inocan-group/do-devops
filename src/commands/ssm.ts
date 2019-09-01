import {
  getConfig,
  buildServerlessMicroserviceProject,
  determineRegion,
  determineProfile,
  determineStage
} from "../shared";
import chalk from "chalk";
import { isServerless } from "../shared/serverless/isServerless";
import commandLineArgs = require("command-line-args");
import { DoSsmOptions } from "./options/ssm";

/**
 * Description of command for help text
 */
export function description() {
  return "allows an easy CRUD-based interaction with AWS's SSM parameter system for managing secrets.";
}

export async function handler(argv: string[], opts: any) {
  const config = await getConfig();
  const subCommand = argv[0];
  const ssmCmd = commandLineArgs(DoSsmOptions, {
    argv: argv.slice(1),
    partial: true
  });

  const ssmCommands = ["list", "get", "set"];
  if (!ssmCommands.includes(subCommand)) {
    console.log(
      `- please choose a ${chalk.italic("valid")} ${chalk.bold.yellow(
        "SSM"
      )} sub-command: ${ssmCommands.join(", ")}`
    );
    console.log();
    process.exit();
  }

  const serverless = await isServerless();
  if (
    serverless &&
    serverless.isUsingTypescriptMicroserviceTemplate &&
    !serverless.hasServerlessConfig
  ) {
    await buildServerlessMicroserviceProject();
  }

  ssmCmd.ssm.profile = await determineProfile(opts);
  ssmCmd.ssm.region = await determineRegion(opts);
  ssmCmd.ssm.stage = await determineStage(opts);

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
    await execute(ssmCmd);
  } catch (e) {
    console.log(
      `- Ran into error when running "ssm ${subCommand}":\n  ${chalk.red(
        e.message
      )}\n`
    );

    process.exit();
  }
}

import { getConfig, checkIfAwsInstalled, getServerlessYaml } from "../shared";
import { writeSection } from "../shared/writeDefaultConfig";
import chalk from "chalk";
import { isServerless } from "../shared/serverless/isServerless";
import { IDoSsmConfig } from "./defaults";
import commandLineArgs = require("command-line-args");
import { DoSsmOptions } from "./options/ssm";
import { IServerlessConfig } from "common-types";

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

  // if no SSM config; write default value
  if (config.ssm === undefined) {
    const ssmConfig: IDoSsmConfig = {};
    await writeSection("ssm", ssmConfig);
    config.ssm = ssmConfig;
  }

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
  if (serverless && serverless.isUsingTypescriptMicroserviceTemplate) {
    // TODO: build provider section from config
  }

  let slsConfig: IServerlessConfig;
  if (serverless && serverless.hasServerlessConfig) {
    try {
      slsConfig = await getServerlessYaml();
      ssmCmd.ssm.region = ssmCmd.ssm.region || slsConfig.provider.region;
      ssmCmd.ssm.profile = ssmCmd.ssm.profile || slsConfig.provider.profile;
      ssmCmd.ssm.stage = ssmCmd.ssm.stage || slsConfig.provider.stage;
    } catch (e) {
      console.log("- Problem loading the serverless.yml file!\n");
      console.log(chalk.red("  " + e.message));

      process.exit();
    }
  }

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

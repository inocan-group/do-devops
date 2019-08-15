import { getConfig } from "../shared";
import { writeSection } from "../shared/writeDefaultConfig";
import { asyncExec } from "async-shelljs";
import chalk from "chalk";
import { isServerless } from "../shared/serverless/isServerless";
import { IDoSsmConfig } from "./defaults";
import commandLineArgs = require("command-line-args");
import { DoSsmOptions } from "./options/ssm";

export async function handler(argv: string[], opts: any) {
  const config = await getConfig();
  const subCommand = argv[0];
  const ssmCmd = commandLineArgs(DoSsmOptions, {
    argv: argv.slice(1),
    partial: true
  });

  // if no SSM config go get it
  if (config.ssm === undefined || config.ssm.hasAwsInstalled === undefined) {
    const whereIsConfig = await isServerless();
    const ssmConfig: IDoSsmConfig = {
      hasAwsInstalled: await checkIfAwsInstalled(),
      findProfileIn: !whereIsConfig
        ? "default"
        : whereIsConfig.isUsingTypescriptMicroserviceTemplate
        ? "typescript-microservice"
        : whereIsConfig.hasServerlessConfig
        ? "serverless-yaml"
        : undefined
    };
    await writeSection("ssm", ssmConfig);
    config.ssm = ssmConfig;
  }

  if (!config.ssm.hasAwsInstalled) {
    console.log(`- In order to run SSM commands you must install the AWS CLI`);
    console.log(
      chalk.grey(
        "- for more info check out: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html"
      )
    );
    console.log();
    process.exit();
  }

  const ssmCommands = ["list", "get", "set"];
  if (!ssmCommands.includes(subCommand)) {
    console.log(
      `- please choose a ${chalk.italic("valid")} ${chalk.bold.yellow(
        "SSM"
      )} command; these are: ${ssmCommands.join(", ")}`
    );
    console.log();
    process.exit();
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
  const { execute } = await import(importPath);

  await execute(ssmCmd);

  let profile: string;
  // if (config.ssm.findProfileIn === "typescript-microservice") {
  //   profile =
  // }
}

function checkIfAwsInstalled() {
  try {
    const test = asyncExec(`aws`, { silent: true });
    return true;
  } catch (e) {
    return false;
  }
}

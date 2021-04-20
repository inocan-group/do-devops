import chalk from "chalk";
import { IDictionary } from "common-types";
import { buildLambdaTypescriptProject } from "~/shared/serverless";
import { isServerless } from "~/shared/observations";
import { subCommands } from "~/commands/ssm/private";

export interface ISubCommandHash {
  [cmd: string]: { execute: (argv: string[], opts: IDictionary) => Promise<void> };
}

export async function handler(argv: string[], ssmOptions: IDictionary) {
  const subCommand = argv.shift() || "";

  if (!Object.keys(subCommands).includes(subCommand)) {
    console.log(
      `- please choose a ${chalk.italic("valid")} ${chalk.bold.yellow(
        "SSM"
      )} sub-command: ${Object.keys(subCommands).join(", ")}`
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
    await buildLambdaTypescriptProject();
  }

  try {
    await subCommands[subCommand as keyof typeof subCommands].execute(
      argv,
      ssmOptions as any
    );
  } catch (error) {
    console.log(
      chalk`{red - Ran into error when running "ssm ${subCommand}":}\n  - ${error.message}\n`
    );
    console.log(chalk`{grey - ${error.stack}}`);

    process.exit(1);
  }
}

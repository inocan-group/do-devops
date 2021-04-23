import chalk from "chalk";
import { IDictionary } from "common-types";
import { buildLambdaTypescriptProject } from "~/shared/serverless";
import { subCommands } from "~/commands/ssm/private";
import { DoDevopsHandler } from "~/@types/command";
import { ISsmOptions } from "./options";

export interface ISubCommandHash {
  [cmd: string]: { execute: (argv: string[], opts: IDictionary) => Promise<void> };
}

export const handler: DoDevopsHandler<ISsmOptions> = async ({
  argv,
  opts,
  observations,
}) => {
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

  const serverless =
    observations.includes("serverlessFramework") && observations.includes("serverlessTs");
  if (serverless) {
    await buildLambdaTypescriptProject();
  }

  try {
    await subCommands[subCommand as keyof typeof subCommands].execute(argv, opts as any);
  } catch (error) {
    console.log(
      chalk`{red - Ran into error when running "ssm ${subCommand}":}\n  - ${error.message}\n`
    );
    console.log(chalk`{grey - ${error.stack}}`);

    process.exit(1);
  }
};

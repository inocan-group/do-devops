import chalk from "chalk";
import { buildLambdaTypescriptProject } from "~/shared/serverless";
import { subCommands } from "~/commands/ssm/private";
import { DoDevopsHandler } from "~/@types/command";
import { ISsmOptions } from "./options";

export const handler: DoDevopsHandler<ISsmOptions> = async (input) => {
  const { subCommand, observations } = input;
  const validSubCommands = ["list", "get", "set"];

  if (!subCommand) {
    console.log(
      chalk`- the SSM command requires you pick a valid sub-command; choose from: {italic ${validSubCommands.join(
        ", "
      )}}`
    );
    process.exit();
  }

  if (!validSubCommands.includes(subCommand)) {
    console.log(
      `- please choose a ${chalk.italic("valid")} ${chalk.bold.yellow(
        "SSM"
      )} sub-command: ${Object.keys(subCommands).join(", ")}`
    );
    console.log();
    process.exit();
  }

  const serverless = observations.has("serverlessFramework") && observations.has("serverlessTs");
  if (serverless) {
    await buildLambdaTypescriptProject();
  }

  try {
    await subCommands[subCommand as keyof typeof subCommands].execute(input);
  } catch (error) {
    console.log(
      chalk`{red - Ran into error when running "ssm ${subCommand}":}\n  - ${error.message}\n`
    );
    console.log(chalk`{grey - ${error.stack}}`);

    process.exit(1);
  }
};

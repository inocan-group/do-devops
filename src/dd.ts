#!/usr/bin/env node
import chalk from "chalk";
import commandLineArgs from "command-line-args";
import * as process from "process";

import { getCommand, getAllCommands, isKnownCommand, parseCmdArgs } from "~/shared/core";
import { help } from "./shared/core/help";
import { inverted } from "./shared/ui";
import { getObservations } from "./shared/observations/getObserverations";

(async () => {
  // pull off the command and stop there
  const mainCommand = commandLineArgs([{ name: "command", defaultOption: true, type: String }], {
    stopAtFirstUnknown: true,
  });
  const remaining = mainCommand._unknown || [];
  console.log({ remaining, mainCommand });

  /** the primary command */
  const cmd = mainCommand.command as string | undefined;

  console.log(chalk.bold(`\ndo-devops ${chalk.green.italic.bold(cmd ? cmd + " " : "Help")}\n`));
  const observations = getObservations();

  if (!cmd) {
    help({}, observations);
  }

  if (isKnownCommand(cmd)) {
    const subCommand = getCommand(cmd);
    const cmdInput = { ...parseCmdArgs(subCommand, remaining), observations };

    if (cmdInput.opts.help) {
      help(cmdInput, observations, cmd);
    }

    try {
      await subCommand.handler(cmdInput);
      if (cmdInput.unknown) {
        if (cmdInput.unknown.length > 1) {
          console.log(
            chalk`- Note: there were ${cmdInput.unknown.length} parameters received which were {italic unknown} and therefore ignored.`
          );
          console.log(chalk`{gray - these parameters were: ${cmdInput.unknown.join(", ")}}`);
        } else {
          console.log(
            chalk`- Note: the argument {inverse ${cmdInput.unknown[0]}} was unknown and therefore ignored.`
          );
        }
      }
    } catch (error) {
      console.log(
        chalk`\n{red An Error has occurred while running: {italic {bold do-devops ${cmd}}}}`
      );
      console.log(`- ${error.message}`);
      console.log(chalk`{grey   ${error.stack}}\n`);

      process.exit();
    }
  } else {
    console.log(
      `${chalk.bold.red("Whoops! ")} ${chalk.italic.yellowBright(
        cmd
      )} is an unknown command! \n\n` +
        `- Valid command syntax is: ${chalk.bold.inverse(
          " dd [command] <options> "
        )}\n  where valid commands are: ${chalk.italic(
          getAllCommands()
            .map((i) => i.kind)
            .sort()
            .join(", ")
        )}\n\n` +
        chalk`{dim - If you want more help with a specific command, use} ${inverted(
          " dd [cmd] --help "
        )}\n`
    );
  }
})();

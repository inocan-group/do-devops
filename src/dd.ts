#!/usr/bin/env node

import chalk from "chalk";
import * as process from "process";

import { getCommandInterface, globalAndLocalOptions, inverted } from "./shared";

import { getCommands } from "./shared/commands/getCommands";
import { help } from "./commands/help";

import commandLineArgs = require("command-line-args");
import { isKnownCommand } from "./shared/commands";

(async () => {
  // pull off the command and stop there
  const mainCommand = commandLineArgs(
    [{ name: "command", defaultOption: true, type: String }],
    { stopAtFirstUnknown: true }
  );

  const cmd = (mainCommand._all || {}).command;

  let opts = mainCommand.global;

  console.log(
    chalk.bold.white(`\ndo-devops ${chalk.green.italic.bold(cmd ? cmd + " " : "Help")}\n`)
  );

  if (!cmd) {
    await help(opts);
  }

  if (isKnownCommand(cmd)) {
    opts =
      commandLineArgs(await globalAndLocalOptions({}, cmd), {
        partial: true,
      }) || {};

    const subModule = getCommandInterface(cmd);
    const subModuleArgv = opts._unknown.filter((i: any) => i !== cmd);
    const subModuleOpts = opts._all;

    if (subModuleOpts.help) {
      await help(subModuleOpts, cmd);
    }

    try {
      await subModule.handler(subModuleArgv, subModuleOpts);
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
        `- Valid command syntax is: ${chalk.bold(
          "dd [command] <options>"
        )}\n  where valid commands are: ${chalk.italic(
          getCommands().sort().join(", ")
        )}\n\n` +
        `- If you want more help use the ${inverted(" --help ")} option\n`
    );
  }
})();

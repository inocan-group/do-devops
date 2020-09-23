#!/usr/bin/env node

import chalk from "chalk";
import * as process from "process";

import { getCommandInterface, globalAndLocalOptions, globalOptions, inverted } from "./shared";

import { OptionDefinition } from "command-line-args";
import { getCommands } from "./shared/getCommands";
import { help } from "./commands/help";

import commandLineArgs = require("command-line-args");

(async () => {
  const command: OptionDefinition[] = [{ name: "command", defaultOption: true }, ...globalOptions];
  const mainCommand = commandLineArgs(command, { stopAtFirstUnknown: true });
  const cmd = (mainCommand._all || {}).command;
  let argv = mainCommand._unknown || [];
  let opts = mainCommand.global;

  console.log(chalk.bold.white(`do ${chalk.green.italic.bold(cmd ? cmd + " " : "Help")}\n`));

  if (!cmd) {
    await help(opts);
  }

  if (getCommands().includes(cmd)) {
    opts =
      commandLineArgs(await globalAndLocalOptions({}, cmd), {
        partial: true,
      }) || {};

    let subModule = getCommandInterface(cmd);
    const subModuleArgv = opts._unknown.filter((i: any) => i !== cmd);
    const subModuleOpts = opts._all;

    if (subModuleOpts.help) {
      await help(subModuleOpts, cmd);
    }

    try {
      await subModule.handler(subModuleArgv, subModuleOpts);
    } catch (e) {
      console.log(chalk`\n{red An Error has occurred while running: {italic {bold do ${cmd}}}}`);
      console.log(`- ${e.message}`);
      console.log(chalk`{grey   ${e.stack}}\n`);

      process.exit();
    }
  } else {
    console.log(
      `${chalk.bold.red("DO:")} "${cmd}" is an unknown command! \n\n` +
        `- Valid command syntax is: ${chalk.bold(
          "do [command] <options>"
        )}\n  where valid commands are: ${chalk.italic(getCommands().sort().join(", "))}\n` +
        `- If you want more help use the ${inverted(" --help ")} option\n`
    );
  }
})();

#!/usr/bin/env node
import { OptionDefinition } from "command-line-args";
import {
  globalOptions,
  inverted,
  globalAndLocalOptions,
  getCommandInterface
} from "./shared";
import commandLineArgs = require("command-line-args");
import chalk from "chalk";
import { commands } from "./shared/commands";
import { help } from "./commands/help";
import * as process from "process";

(async () => {
  const command: OptionDefinition[] = [
    { name: "command", defaultOption: true },
    ...globalOptions
  ];
  const mainCommand = commandLineArgs(command, { stopAtFirstUnknown: true });
  const cmd = (mainCommand._all || {}).command;
  let argv = mainCommand._unknown || [];
  let opts = mainCommand.global;

  console.log(
    chalk.bold.white(
      `do ${chalk.green.italic.bold(cmd ? cmd + " " : "Help")}\n`
    )
  );

  if (!cmd) {
    await help(opts);
  }

  if (commands().includes(cmd)) {
    opts =
      commandLineArgs(await globalAndLocalOptions({}, cmd), {
        partial: true
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
      console.log(chalk`{red - unhandled {bold do} error!}`);
      console.log(`- ${e.message}`);
      console.log(chalk`{grey ${e.stack}}\n`);

      process.exit();
    }
  } else {
    console.log(
      `${chalk.bold.red("DO:")} "${cmd}" is an unknown command! \n\n` +
        `- Valid command syntax is: ${chalk.bold(
          "do [command] <options>"
        )}\n  where valid commands are: ${chalk.italic(
          commands().join(", ")
        )}\n` +
        `- If you want more help use the ${inverted(" --help ")} option\n`
    );
  }
})();

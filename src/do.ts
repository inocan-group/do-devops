#!/usr/bin/env node
import { OptionDefinition } from "command-line-args";
import { DoGlobalOptions, inverted } from "./shared";
import commandLineArgs = require("command-line-args");
import chalk from "chalk";
import { commands } from "./shared";
import { IDoHandler } from "./shared/@types";
import { help } from "./commands/help";

(async () => {
  const command: OptionDefinition[] = [
    { name: "command", defaultOption: true },
    ...DoGlobalOptions
  ];
  const mainCommand = commandLineArgs(command, { stopAtFirstUnknown: true });
  const cmd = (mainCommand._all || {}).command;
  let argv = mainCommand._unknown || [];
  const opts = mainCommand.global;

  console.log(
    chalk.bold.white.underline(
      `DevOps [DO] ${chalk.italic.bold(cmd ? cmd + " " : "Help")}\n`
    )
  );

  if (!cmd) {
    help(DoGlobalOptions, cmd);
  }

  if (commands().includes(cmd)) {
    let subModule: IDoHandler = await import(`./commands/${cmd}`);
    await subModule.handler(argv, opts);
  } else {
    console.log(
      `${chalk.bold.red("DO:")} "${cmd}" is an unknown command!\n\n` +
        `- Valid command syntax is: ${chalk.bold(
          "do [command] <options>"
        )}\n  where valid commands are: ${chalk.italic(commands().join(", "))}\n` +
        `- If you want more help use the ${inverted(" --help ")} option\n`
    );
  }
})();

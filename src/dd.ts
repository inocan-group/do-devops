#!/usr/bin/env node
import chalk from "chalk";
import commandLineArgs from "command-line-args";
import * as process from "process";

import {
  getCommand,
  getAllCommands,
  isKnownCommand,
  parseCmdArgs,
  proxyToPackageManager,
} from "~/shared/core";
import { help } from "./shared/core/help";
import { inverted } from "./shared/ui";
import { getObservations } from "./shared/observations/getObserverations";
import { doDevopsVersion, commandAnnouncement } from "./shared/core/util";
import { hasScript } from "./shared/npm";

(async () => {
  // pull off the command and stop there
  const mainCommand = commandLineArgs([{ name: "command", defaultOption: true, type: String }], {
    stopAtFirstUnknown: true,
  });
  const remaining = mainCommand._unknown || [];

  /** the primary command */
  const cmdName = mainCommand.command as string | undefined;
  // undocumented version switch
  if (!cmdName && mainCommand._unknown && mainCommand._unknown.includes("--version")) {
    console.log(doDevopsVersion());
    process.exit();
  }

  const observations = getObservations();

  // undocumented observations switch
  if (!cmdName && mainCommand._unknown && mainCommand._unknown.includes("--observations")) {
    console.log(`Observations:`, [...observations].map((i) => chalk`{inverse  ${i} }`).join(" "));
    process.exit();
  }

  if (!cmdName) {
    commandAnnouncement(undefined, undefined, true);
    help(observations);
    process.exit();
  }

  if (isKnownCommand(cmdName)) {
    const cmdDefn = getCommand(cmdName);
    const cmdInput = { ...parseCmdArgs(cmdDefn, remaining), observations };

    if (cmdInput.opts.help) {
      commandAnnouncement(cmdDefn, cmdInput.subCommand, true);
      help(observations, cmdDefn);
      process.exit();
    }

    try {
      commandAnnouncement(cmdDefn, cmdInput.subCommand);
      await cmdDefn.handler(cmdInput);
      if (cmdInput.unknown && cmdInput.unknown.filter((i) => i).length > 0) {
        const plural = cmdInput.unknown.length === 1 ? false : true;
        const preposition = cmdInput.unknown.length === 1 ? "was" : "were";
        console.log(
          chalk`- Note: {italic there ${preposition} ${
            cmdInput.unknown.length
          } {italic unknown} parameter${
            plural ? "s" : ""
          } received (and ignored): {gray ${cmdInput.unknown.join(", ")}}}`
        );
      }
    } catch (error) {
      console.log(
        chalk`\n{red An Error has occurred while running: {italic {bold do-devops ${cmdName}}}}`
      );
      console.log(`- ${(error as Error).message}`);
      console.log(chalk`{grey   ${(error as Error).stack}}\n`);

      process.exit();
    }
  } else {
    // check if the command is an **npm** script name
    // and proxy to it if it is
    if (hasScript(cmdName)) {
      proxyToPackageManager(cmdName, observations, mainCommand._unknown);
    } else {
      console.log(
        `${chalk.bold.red("Whoops! ")} ${chalk.italic.yellowBright(
          cmdName
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
  }
})();

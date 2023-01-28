#!/usr/bin/env node
import chalk from "chalk";
import commandLineArgs from "command-line-args";

import {
  getCommand,
  getAllCommands,
  parseCmdArgs,
  proxyToPackageManager,
  isKnownCommand,
} from "src/shared/core/index";
import { help } from "./shared/core/help";
import { emoji, inverted, wordWrap } from "./shared/ui";
import { getObservations } from "./shared/observations/getObservations";
import { doDevopsVersion, commandAnnouncement, hasArgv, getArgvOption } from "./shared/core/util";
import { hasScript } from "./shared/npm";
import { CommandParsing } from "./@types/global";
import { isDevopsError } from "./@type-guards";
import { Command } from "./@types";

// eslint-disable-next-line unicorn/prefer-top-level-await
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
    console.log(
      chalk.yellowBright`Observations:\n`,
      wordWrap([...observations].map((i) => chalk.dim(i)).join(chalk.dim(", ")))
    );
    process.exit();
  }

  if (!cmdName) {
    commandAnnouncement();
    help(observations);
    process.exit();
  }

  if (isKnownCommand(cmdName)) {
    const cmdDefn = getCommand(cmdName);
    const parsedInput = parseCmdArgs(cmdDefn, remaining);
    

    // Show help on the command
    if (parsedInput.opts?.help) {
      commandAnnouncement(cmdDefn, parsedInput);
      
      help(observations, cmdDefn);
      process.exit();
    }

    // Try to execute the command
    try {
      commandAnnouncement(cmdDefn, cmdInput);
      cmdInput = {
        ...cmdInput,
        observations,
        argv: hasArgv(cmdDefn) ? cmdInput.opts[getArgvOption(cmdDefn)?.name as any] : [],
      } as CommandParsing;
      await cmdDefn.handler(cmdInput);
      if (cmdInput.unknown && cmdInput.unknown?.filter((i) => i).length > 0) {
        const plural = cmdInput.unknown.length === 1 ? false : true;
        const preposition = cmdInput.unknown.length === 1 ? "was" : "were";
        console.error(
          `- Note: ${chalk.italic`there ${preposition}`} ${cmdInput.unknown.length} ${chalk.italic`unknown`} parameter${plural ? "s" : ""} received (and ignored): ${chalk.gray(cmdInput.unknown.join(", "))}`
        );
      }
    } catch (error) {
      console.error(
        `\n{red An Error has occurred while running: ${chalk.italic.bold`do-devops ${cmdName}`}`
      );
      console.error(`- ${(error as Error).message}`);
      console.error(chalk.gray`  ${(error as Error).stack}\n`);

      process.exit();
    }
  } else {
    // check if the command is an **npm** script name
    // and proxy to it if it is
    let useScriptProxy: boolean | undefined;
    try {
      useScriptProxy = hasScript(cmdName) || ["link", "unlink"].includes(cmdName);
    } catch (error) {
      useScriptProxy =
        isDevopsError(error) && error.classification === "not-ready/missing-package-json"
          ? false
          : undefined;
    }

    if (useScriptProxy) {
      proxyToPackageManager(cmdName, observations, mainCommand._unknown);
    } else {
      const noPkgJsonMsg =
        useScriptProxy === undefined
          ? ""
          : chalk.dim`\n\n - Note: you're in a directory with no ${chalk.italic`package.json`} file so if you\nwere trying to proxy a script please move to the right directory first.`;
      console.log(
        `${emoji.poop} ${chalk.italic.yellowBright`${cmdName}`}} is an unknown command!${noPkgJsonMsg} \n\n` +
          `- Valid command syntax is: ${chalk.bold.inverse(
            " dd [command] <options> "
          )}\n  where valid commands are: ${chalk.italic(
            getAllCommands()
              .map((i) => i.kind)
              .sort()
              .join(", ")
          )}\n\n` +
          `${chalk.dim(` - If you want more help with a specific command, use`)} ${inverted(
            " dd [cmd] --help "
          )}\n`
      );
    }
  }
})();

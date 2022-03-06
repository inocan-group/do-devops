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
} from "~/shared/core/index";
import { help } from "./shared/core/help";
import { emoji, inverted } from "./shared/ui";
import { getObservations } from "./shared/observations/getObserverations";
import { doDevopsVersion, commandAnnouncement, hasArgv, getArgvOption } from "./shared/core/util";
import { hasScript } from "./shared/npm";
import { CommandParsing } from "./@types/global";
import { isDevopsError } from "./@type-guards";

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
    commandAnnouncement();
    help(observations);
    process.exit();
  }

  if (isKnownCommand(cmdName)) {
    const cmdDefn = getCommand(cmdName);
    let cmdInput: CommandParsing = { ...parseCmdArgs(cmdDefn, remaining), observations };

    if (cmdInput.opts.help) {
      commandAnnouncement(cmdDefn, cmdInput);
      help(observations, cmdDefn);
      process.exit();
    }

    try {
      commandAnnouncement(cmdDefn, cmdInput);
      cmdInput = {
        ...cmdInput,
        argv: hasArgv(cmdDefn) ? cmdInput.opts[getArgvOption(cmdDefn)?.name as any] : [],
      } as CommandParsing;
      await cmdDefn.handler(cmdInput);
      if (cmdInput.unknown && cmdInput.unknown?.filter((i) => i).length > 0) {
        const plural = cmdInput.unknown.length === 1 ? false : true;
        const preposition = cmdInput.unknown.length === 1 ? "was" : "were";
        console.error(
          chalk`- Note: {italic there ${preposition} ${
            cmdInput.unknown.length
          } {italic unknown} parameter${
            plural ? "s" : ""
          } received (and ignored): {gray ${cmdInput.unknown.join(", ")}}}`
        );
      }
    } catch (error) {
      console.error(
        chalk`\n{red An Error has occurred while running: {italic {bold do-devops ${cmdName}}}}`
      );
      console.error(`- ${(error as Error).message}`);
      console.error(chalk`{grey   ${(error as Error).stack}}\n`);

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
        typeof useScriptProxy === "undefined"
          ? ""
          : chalk`\n\n{dim - Note: you're in a directory with no {italic package.json} file so if you\nwere trying to proxy a script please move to the right directory first.}`;
      console.log(
        chalk`${emoji.poop} {italic {yellowBright ${cmdName}}} is an unknown command!${noPkgJsonMsg} \n\n` +
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

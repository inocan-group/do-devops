/* eslint-disable unicorn/prefer-module */
import chalk from "chalk";
import { CommandParsing as ICommandParsing, IDoDevopsCommand } from "src/@types";
import { logger } from "../logger";
import { doDevopsVersion } from "./doDevopsVersion";

/**
 * Announces the command being executed to the console
 */
export function commandAnnouncement(cmdDefn?: IDoDevopsCommand, cmd?: ICommandParsing) {
  const log = logger(cmd ? cmd.opts : {});
  const version = doDevopsVersion();
  const argv = cmd && cmd.argv.length > 0 
    ? chalk.italic` ${cmd.argv.join(" ")}` 
    : "";
  
  const subCmd = cmd && cmd.subCommand ? chalk.dim`  ${cmd.subCommand}` : "";

  const helpText =
    (!cmdDefn && !cmd) || (cmd && cmd.opts?.help)
      ? cmdDefn
        ? ` [ help, v${version} ]`
        : `  v${version}`
      : "";

  const brand = cmdDefn 
    ? chalk.green.italic.bold(`${cmdDefn.kind}${subCmd}${argv}`)
    : chalk.green.italic.bold("Help");
    
  log.info(
    chalk.bold(
      `\ndo-devops ${brand}${chalk.gray(helpText)}\n`
    )
  );
}

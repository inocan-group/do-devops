/* eslint-disable unicorn/prefer-module */
import chalk from "chalk";
import { CommandParsing as ICommandParsing, IDoDevopsCommand } from "src/@types";
import { logger } from "../logger";
import { doDevopsVersion } from "./doDevopsVersion";

/**
 * Annouces the command being executed to the console
 */
export function commandAnnouncement(cmdDefn?: IDoDevopsCommand, cmd?: ICommandParsing) {
  const log = logger(cmd ? cmd.opts : {});
  const version = doDevopsVersion();

  const argv = cmd && cmd.argv.length > 0 ? ` {italic ${cmd.argv.join(" ")}}` : "";

  const subCmd = cmd && cmd.subCommand ? ` {dim ${cmd.subCommand}}` : "";

  const helpText =
    (!cmdDefn && !cmd) || (cmd && cmd.opts?.help)
      ? cmdDefn
        ? `{gray  [help, v${version}]}`
        : `{gray  v${version}}`
      : "";

  log.info(
    chalk.bold(
      `\ndo-devops ${chalk.green.italic.bold(
        cmdDefn ? `${cmdDefn.kind}${subCmd}${argv}` : "Help"
      )}${helpText}\n`
    )
  );
}

/* eslint-disable unicorn/prefer-module */
import chalk from "chalk";
import { IDoDevopsCommand } from "~/@types";
import { doDevopsVersion } from "./doDevopsVersion";

/**
 * Annouces the command being executed to the console
 */
export function commandAnnouncement(
  cmdDefn?: IDoDevopsCommand,
  subCommand?: string,
  isHelp?: boolean
) {
  const version = doDevopsVersion();

  console.log(
    chalk.bold(
      `\ndo-devops ${chalk.green.italic.bold(
        cmdDefn ? `${cmdDefn.kind}${subCommand ? ` ${subCommand}` : ""}` : "Help"
      )}${isHelp && cmdDefn ? chalk.dim.grey(` [help, v${version}]`) : ""}${
        isHelp && !cmdDefn ? chalk.dim.grey(` v${version}`) : ""
      }\n`
    )
  );
}

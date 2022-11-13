import chalk from "chalk";
import { IDictionary } from "common-types";
import {
  DynamicCommandDefinition,
  ICommandDescriptor,
  IDoDevopsCommand,
  IOptionDefinition,
  isCommandDescriptor,
  isDynamicCommandDefinition,
} from "src/@types";
import { convertOptionsToArray } from "src/shared/core";
import commands from "src/commands/index";
import { keys } from "inferred-types";
import { getObservations } from "../observations";

// /**
//  * Formats commands so that:
//  *
//  * 1. alternating white/dim per line item
//  * 2. multi-line descriptions are truncated to first line
//  */
// function formatCommands(cmds: ICommandDescription[]) {
//   let dim = false;

//   return cmds.map((cmd) => {
//     const summary = Array.isArray(cmd.summary) ? cmd.summary.split("\n")[0] : cmd.summary;

//     cmd.name = dim ? `{dim ${cmd.name}}` : cmd.name;
//     cmd.summary = dim ? `{dim ${summary}}` : summary;
//     dim = !dim;

//     return cmd;
//   });
// }

/**
 * Gets the syntax for the help system for both "global help"
 * as well as on a per function basis. The syntax for a function
 * can be manually set by providing a `syntax` symbol on the
 * command. If not provided a default syntax will be used.
 */
export function getSyntax(fn?: string): string {
  if (!fn) {
    return "dd [command] <options>";
  } else {
    const validCommands = keys(commands);
    if ((validCommands as string[]).includes(fn)) {
      const defn: IDoDevopsCommand<any> = commands[fn as keyof typeof commands];
      const hasSubCommands = defn?.subCommands ? true : false;
      return defn.syntax ? defn.syntax : `do ${fn} ${hasSubCommands ? "[command] " : ""}`;
    } else {
      return chalk`dd [command] <options>\nnote: the command {red ${fn}} is not recognized!`;
    }
  }
}

/**
 * Gets the "description" content for the help area
 */
export function getDescription(opts: IDictionary, fn?: keyof typeof commands) {
  if (!fn) {
    return `DevOps toolkit [ ${chalk.bold.italic(
      "dd"
    )} ] is a simple CLI interface intended to automate most of the highly repeatable tasks on your team.`;
  }

  const desc = commands[fn].description;

  return desc
    ? isDynamicCommandDefinition(desc)
      ? desc(getObservations(), opts)
      : isCommandDescriptor(desc)
      ? desc.complete
      : desc
    : `Help content for the {bold do}'s ${chalk.bold.green.italic(fn)} command.`;
}

export function getExamples(opts: IOptionDefinition, fn?: keyof typeof commands) {
  // nothing to do if no function is chosen
  if (fn) {
    const defn = commands[fn];
    return defn.examples || ([] as string[]);
  }

  return [] as string[];
}

export async function getOptions(opts: IOptionDefinition, _fn?: string) {
  return convertOptionsToArray(opts);
}

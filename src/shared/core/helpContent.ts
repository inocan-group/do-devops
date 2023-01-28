import chalk from "chalk";
import { IDictionary } from "common-types";
import {
  Command,
  OptionDefn,
  isCommandDescriptor,
  isDynamicCommandDefinition,
} from "src/@types";
import { convertOptionsToArray } from "src/shared/core";
import commands from "src/commands/index";
import { keys } from "inferred-types";
import { getObservations } from "../observations";

/**
 * Gets the syntax for the help system for both "global help"
 * as well as on a per function basis. The syntax for a function
 * can be manually set by providing a `syntax` symbol on the
 * command. If not provided a default syntax will be used.
 */
export function getSyntax(fn?: string): string {
  if (fn) {
    const validCommands = keys(commands);
    if ((validCommands as string[]).includes(fn)) {
      const defn: Command<any> = commands[fn as keyof typeof commands];
      const hasSubCommands = defn?.subCommands ? true : false;
      return defn.syntax ?? `do ${fn} ${hasSubCommands ? "[command] " : ""}`;
    } else {
      const fnName = chalk.red(fn);
      return `dd [command] <options>\nnote: the command ${fnName} is not recognized!`;
    }
  } else {
    return "dd [command] <options>";
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

export function getExamples(_opts: OptionDefn, fn?: keyof typeof commands) {
  // nothing to do if no function is chosen
  if (fn) {
    const defn = commands[fn];
    return defn.examples || ([] as string[]);
  }

  return [] as string[];
}

export async function getOptions(opts: OptionDefn, _fn?: string) {
  return convertOptionsToArray(opts);
}

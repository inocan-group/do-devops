import chalk from "chalk";
import { IDictionary } from "common-types";
import {
  DoDevopObservation,
  Finalized,
  IDoDevopsCommand,
  isCommandDescriptor,
  isDynamicCommandDefinition,
} from "src/@types";
import { globalOptions } from "src/shared/core";
import { getArgvOption, hasArgv } from "./argv";

/**
 * Gets _finalized_ meta information about the specific functions where being
 * _finalized_ indicates that dynamic values have been resolved to static values
 * by passing in the _observervations_ and parsed _options_ available at this time
 */
export function finalizeCommandDefinition(
  cmdDefn: IDoDevopsCommand,
  /** all known observations available at this time */
  observations: Set<DoDevopObservation>,
  /** any/all parsed options available at this time */
  options: IDictionary = {}
): Finalized<IDoDevopsCommand> {
  const isGlobal = cmdDefn ? false : true;

  // description
  const d1 = isDynamicCommandDefinition(cmdDefn.description)
    ? cmdDefn.description(observations, options)
    : cmdDefn.description;
  const description = isCommandDescriptor(d1) ? (isGlobal ? d1.short : d1.complete) : d1;
  // commands
  const subCommands = isDynamicCommandDefinition(cmdDefn.subCommands)
    ? cmdDefn.subCommands(observations, options)
    : cmdDefn.subCommands;

  const argv = hasArgv(cmdDefn) ? chalk` {italic {dim argv[]}}` : "";
  const argvDescription = getArgvOption(cmdDefn)?.description
    ? chalk`\n\n\t\t{bold {blue [argv]:}} ${getArgvOption(cmdDefn)?.description}`
    : "";

  const subCommandSyntax =
    subCommands && subCommands.length > 0
      ? chalk` {bold <cmd:}{dim ${subCommands
          .map((i) => i.name)
          .join(chalk`{blue {bold |}}`)}}{bold >}`
      : "";

  return {
    kind: cmdDefn.kind,
    handler: cmdDefn.handler,
    syntax:
      cmdDefn.syntax ||
      chalk`dd ${cmdDefn.kind}${subCommandSyntax}${argv} [{italic options}]${argvDescription}`,
    description,
    subCommands,
    options: { ...cmdDefn.options, ...globalOptions },
    hiddenCommand: false,
  };
}

import { IDictionary } from "common-types";
import {
  DoDevopObservation,
  Finalized,
  IDoDevopsCommand,
  isCommandDescriptor,
  isDynamicCommandDefinition,
  KnownCommand,
} from "~/@types";
import { getCommand, globalOptions } from "~/shared/core";

/**
 * Gets _finalized_ meta information about the specific functions where being
 * _finalized_ indicates that dynamic values have been resolved to static values
 * by passing in the _observervations_ and parsed _options_ available at this time
 */
export function getCommandMeta(
  cmd: KnownCommand,
  /** all known observations available at this time */
  observations: DoDevopObservation[],
  /** any/all parsed options available at this time */
  options: IDictionary,
  /**
   * Flag to indicate whether the caller is interested from a "global"
   * or "local" perspective (where "local" means scope is just a single
   * command).
   */
  isGlobal: boolean = false
): Finalized<IDoDevopsCommand> {
  const c = getCommand(cmd);

  // description
  const d1 = isDynamicCommandDefinition(c.description)
    ? c.description(observations, options)
    : c.description;
  const description = isCommandDescriptor(d1) ? (isGlobal ? d1.short : d1.complete) : d1;
  // commands
  const subCommands = isDynamicCommandDefinition(c.subCommands)
    ? c.subCommands(observations, options)
    : c.subCommands;

  return {
    kind: c.kind,
    handler: c.handler,
    syntax: c.syntax || `dd ${cmd} [options]`,
    description,
    subCommands,
    options: { ...c.options, ...globalOptions },
    hiddenCommand: false,
  };
}

import { IDictionary } from "common-types";
import { DoDevopObservation, KnownCommand } from "~/@types";
import * as subCommands from "~/commands/index";
import { getCommandMeta } from "~/shared/core";

/**
 * returns a list of commands (e.g., ssm, info, etc.) supported by `do-devops`
 */
export function getAllCommands(observations: DoDevopObservation[] = [], opts: IDictionary = {}) {
  const cmds = Object.keys(subCommands);
  return cmds.map((cmd) => getCommandMeta(cmd as KnownCommand, observations, opts, true));
}

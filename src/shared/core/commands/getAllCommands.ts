import { IDictionary } from "common-types";
import { DoDevopObservation } from "~/@types";
import * as cmds from "~/commands/index";
import { finalizeCommandDefinition } from "~/shared/core/util";
import { getCommand } from "./getCommand";

/**
 * Returns a list of command definitions supported by `do-devops` in a finalized state.
 */
export function getAllCommands(
  observations: Set<DoDevopObservation> = new Set<DoDevopObservation>(),
  opts: IDictionary = {}
) {
  return Object.keys(cmds).map((cmd) =>
    finalizeCommandDefinition(getCommand(cmd), observations, opts)
  );
}

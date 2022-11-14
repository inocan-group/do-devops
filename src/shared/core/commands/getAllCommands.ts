import { IDictionary } from "common-types";
import { DoDevopObservation } from "src/@types";
import { finalizeCommandDefinition } from "src/shared/core/util";
import { getCommand } from "./getCommand";
import { keys } from "inferred-types";
import commands from "src/commands";

/**
 * Returns a list of command definitions supported by `do-devops` in a finalized state.
 */
export function getAllCommands(
  observations: Set<DoDevopObservation> = new Set<DoDevopObservation>(),
  opts: IDictionary = {}
) {
  return keys(commands).map((cmd) =>
    finalizeCommandDefinition(getCommand(cmd), observations, opts)
  );
}

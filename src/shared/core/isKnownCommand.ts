import { KnownCommand } from "src/@types/command";
import { getAllCommands } from "src/shared/core";

/**
 * Uses `getCommands()` to get a list of valid commands
 * and passes back the string names.
 */
export function isKnownCommand(cmd: unknown): cmd is KnownCommand {
  return (
    typeof cmd === "string" &&
    getAllCommands()
      .map((i) => i.kind)
      .includes(cmd as KnownCommand)
  );
}

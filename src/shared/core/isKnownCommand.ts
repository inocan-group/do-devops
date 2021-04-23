import { KnownCommand } from "~/@types/command";
import { getCommands } from "./getCommands";

/**
 * Uses `getCommands()` to get a list of valid commands
 * and passes back the string names.
 */
export function isKnownCommand(cmd: unknown): cmd is KnownCommand {
  return typeof cmd === "string" && getCommands().includes(cmd);
}

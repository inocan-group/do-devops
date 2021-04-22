import { getCommands } from "./index";

/**
 * Uses `getCommands()` to get a list of valid commands
 * and passes back the string names.
 */
export function isKnownCommand(cmd: string) {
  return getCommands().includes(cmd);
}

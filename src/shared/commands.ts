import * as subCommands from "../commands";

/**
 * returns a list of commands (e.g., ssm, info, etc.)
 */
export function commands() {
  return Object.keys(subCommands).filter(i => i !== "help");
}

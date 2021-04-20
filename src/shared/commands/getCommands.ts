import * as subCommands from "../../commands/index";

/**
 * returns a list of commands (e.g., ssm, info, etc.) supported by `do-devops`
 */
export function getCommands() {
  // TODO: add proper typing once stablized

  return Object.keys(subCommands);
}

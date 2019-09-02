import * as subCommands from "../commands/index";
import { IDictionary } from "common-types";

/**
 * returns a list of commands (e.g., ssm, info, etc.)
 */
export function commands() {
  return Object.keys(subCommands).filter(
    (i: keyof typeof subCommands) =>
      typeof subCommands[i] === "object" &&
      (subCommands[i] as IDictionary).handler
  );
}

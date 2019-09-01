import * as subCommands from "../commands/index";
import { IDictionary } from "common-types";

/**
 * returns a list of commands (or global scope) which have
 * a "default configuration"
 */
export function defaultConfigSections() {
  return Object.keys(subCommands).filter(
    (i: keyof typeof subCommands) =>
      typeof subCommands[i] === "object" &&
      (subCommands[i] as IDictionary).defaultConfig
  );
}

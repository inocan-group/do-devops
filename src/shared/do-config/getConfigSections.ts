import * as defaults from "../../commands/config";
import { IDoConfigSections } from "..";

/**
 * **getConfigSections**
 *
 * returns a list of configuration section _names_; this does NOT
 * include the `global` section
 */
export function getConfigSections(): string[] {
  return Object.keys(defaults).filter((section: IDoConfigSections) => {
    return typeof defaults[section] === "function";
  });
}

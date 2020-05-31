import * as defaults from "../../config";

import { IDoConfig } from "../../@types";

/**
 * **getConfigSections**
 *
 * returns a list of configuration section _names_; this does NOT
 * include the `global` section
 */
export function getConfigSections(): string[] {
  return Object.keys(defaults).filter((section: keyof IDoConfig & keyof typeof defaults) => {
    return typeof defaults[section] === "function";
  });
}

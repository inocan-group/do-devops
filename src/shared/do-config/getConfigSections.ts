import * as defaults from "../../config";

/**
 * **getConfigSections**
 *
 * returns a list of configuration section _names_; this does NOT
 * include the `global` section
 */
export function getConfigSections(): string[] {
  return Object.keys(defaults).filter((section) => {
    return typeof defaults[section as keyof typeof defaults] === "function";
  });
}

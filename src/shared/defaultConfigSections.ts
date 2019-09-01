import * as config from "../commands/config/index";

/**
 * returns a list of commands (or global scope) which have
 * a "default configuration"
 */
export function defaultConfigSections() {
  return Object.keys(config).filter(
    (i: keyof typeof config) => typeof config[i] === "function"
  );
}

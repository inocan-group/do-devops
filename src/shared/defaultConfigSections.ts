import * as config from "~/config";

/**
 * returns a list of commands (or global scope) which have
 * a "default configuration"
 */
export function defaultConfigSections() {
  return Object.keys(config).filter(
    (i) => typeof config[i as keyof typeof config] === "function"
  );
}

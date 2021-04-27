import merge from "deepmerge";
import { omit } from "native-dash";
import { IIntegratedConfig } from "~/@types";
import { getProjectConfig, getUserConfig } from "~/shared/core";

export interface IGetConfigOptions {
  exitIfNotFound: boolean;
}

/**
 * **getConfig**
 *
 * Gets the current configuration based on the `do.config.js` file.
 *
 * By default the configuration that will be loaded is the project's
 * configuration but you can override to use the `user` config
 * or `both`. In the case of `both`, the two config's will be merged
 * and the project config taking precedence.
 *
 * The lack of a configuration file will not be treated as an error
 * but will instead resolve to an empty object.
 */
export function getIntegratedConfig(): IIntegratedConfig {
  const userConfig = getUserConfig();
  const projectConfig = getProjectConfig();

  if (!userConfig.userConfig && !projectConfig.projectConfig) {
    return { kind: "integrated", ready: false, userConfig: false, projectConfig: false };
  }
  const u = omit(userConfig, "kind");
  const p = omit(projectConfig, "kind");

  const merged = merge(merge(u, p), {
    kind: "integrated",
    ready: userConfig.userConfig || projectConfig.projectConfig,
  }) as IIntegratedConfig;

  return merged;
}

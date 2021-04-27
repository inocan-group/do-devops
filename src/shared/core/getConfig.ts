import merge from "deepmerge";
import { IIntegratedConfig, IProjectConfig, IUserConfig } from "~/@types";
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
export async function getConfig(
  source: "user" | "project" | "both" = "both"
): Promise<IIntegratedConfig | IProjectConfig | IUserConfig> {
  const userConfig = getUserConfig();
  const projectConfig = getProjectConfig();

  switch (source) {
    case "both":
      return merge(userConfig, projectConfig);
    case "project":
      return projectConfig;
    case "user":
      return userConfig;
  }
}

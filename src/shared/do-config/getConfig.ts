import { getConfigFilename, writeDefaultConfig } from "./index";

import { IDoConfig } from "../../@types";
import { existsSync } from "fs";
import { DevopsError } from "../errors";

export interface IGetConfigOptions {
  exitIfNotFound: boolean;
}

const cache: {
  user: IDoConfig;
  project: IDoConfig;
} = {
  user: undefined,
  project: undefined,
};

/**
 * **getConfig**
 *
 * Gets the current configuration based on the `do.config.js` file.
 *
 * By default the configuration that will be loaded is the project's
 * configuration but you can state to instead use the `user` config
 * or `both`. In the case of `both`, the two config's will be merged
 * and the project config will take precedence.
 */
export async function getConfig(userOrProject: "user" | "project" | "both" = "both"): Promise<IDoConfig> {
  let config: IDoConfig;
  const userFilename = getConfigFilename("user");
  const projectFilename = getConfigFilename("project");
  const userConfig = existsSync(userFilename) ? (await import(userFilename)).config : {};
  const projectConfig = existsSync(projectFilename) ? await import(projectFilename) : {};

  if (!projectConfig && userOrProject === "project") {
    throw new DevopsError(`Project configuration [${projectFilename}] for do-devops not found!`, "no-config");
  }
  if (!userConfig && userOrProject === "user") {
    throw new DevopsError("User configuration for do-devops not found!", "no-config");
  }
  if (!userConfig && !projectConfig && userOrProject === "both") {
    throw new DevopsError("Neither user nor project configuration for do-devops was found!", "no-config");
  }

  switch (userOrProject) {
    case "both":
      return { ...(userConfig ? userConfig : {}), ...(projectConfig ? projectConfig : {}) };
    case "project":
      return projectConfig;
    case "user":
      return userConfig;
    default:
      throw new DevopsError(`Unknown configuration type "${userOrProject}" passed in!`, "invalid-config-type");
  }
}

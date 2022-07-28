import merge from "deepmerge";
import { omit } from "native-dash";
import { IIntegratedConfig } from "src/@types";
import { getProjectConfig, getUserConfig } from "src/shared/config";

export interface IGetConfigOptions {
  exitIfNotFound: boolean;
}

/**
 * **getIntegratedConfig**
 *
 * Gets both the project and user's configuration and returns an
 * _integrated_ configuration where the project configuration is
 * always preferred.
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

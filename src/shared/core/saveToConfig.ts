import { IDoConfig } from "~/@types";
import { writeConfig, getProjectConfig, getUserConfig } from "~/shared/core";
import merge from "deepmerge";

/**
 * **saveToUserConfig**
 *
 * updates the configuration to a _section_ which is either a command or to
 * the `general` section for shared meta-data. The value passed in is
 * deep copied with the current value to ensure it is non-destructive.
 */
export async function saveToUserConfig<T extends keyof IDoConfig>(
  section: T,
  updatedProps: Partial<IDoConfig[T]>
) {
  let config = getUserConfig();
  if (!config.userConfig) {
    config = { kind: "user", userConfig: true, general: {} };
  }

  const current: Partial<IDoConfig[T]> = config[section] || {};
  const merged = merge(current, updatedProps);
  const newConfig = { ...config, [section]: merged };

  writeConfig(newConfig, "user");
}

/**
 * **saveToUserConfig**
 *
 * updates the configuration to a _section_ which is either a command or to
 * the `general` section for shared meta-data. The value passed in is
 * deep copied with the current value to ensure it is non-destructive.
 */
export async function saveToProjectConfig<T extends keyof IDoConfig>(
  section: T,
  updatedProps: Partial<IDoConfig[T]>
) {
  let config = getProjectConfig();
  if (!config.projectConfig) {
    config = { kind: "project", projectConfig: true, general: {} };
  }
  const current: Partial<IDoConfig[T]> = config[section] || {};
  const merged = merge(current, updatedProps);
  const newConfig = { ...config, [section]: merged };

  writeConfig(newConfig, "project");
}

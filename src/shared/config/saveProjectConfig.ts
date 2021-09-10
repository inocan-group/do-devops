import merge from "deepmerge";
import { writeFileSync } from "fs";
import { set } from "native-dash";
import { IDoConfig, IProjectConfig, IProjectConfigFilled } from "~/@types";
import { currentDirectory } from "../file";
import { CONFIG_FILE, DEFAULT_PROJECT_CONFIG } from "./constants";
import { getProjectConfig } from "./getProjectConfig";

function configMerge<T extends Partial<Omit<IDoConfig, "kind" | "userConfig" | "projectConfig">>>(
  current: IProjectConfig,
  updated: T
) {
  return {
    ...merge(current, updated),
    kind: "project",
    projectConfig: true,
  } as IProjectConfig;
}

function configSet(current: IProjectConfig, dotPath: string, payload: any) {
  const config = {
    ...current,
    kind: "project",
    projectConfig: true,
  } as IProjectConfigFilled;
  set(current, dotPath, payload);
  return config;
}

/**
 * **saveProjectConfig**
 *
 * updates the configuration stored in the current working directory; available
 * in two different signature types. Use _set_ calling structure if modifying
 * an array (as pure object merge will only concat arrays)
 */
async function saveProjectConfig<
  T extends Partial<Omit<IDoConfig, "kind" | "userConfig" | "projectConfig">>
>(updated: T): Promise<IProjectConfigFilled>;
async function saveProjectConfig(dotPath: string, payload: any): Promise<IProjectConfigFilled>;
async function saveProjectConfig<
  T extends Partial<Omit<IDoConfig, "kind" | "userConfig" | "projectConfig">>
>(first: T | string, second?: any): Promise<IProjectConfigFilled> {
  let current = getProjectConfig();
  if (!current.projectConfig) {
    current = DEFAULT_PROJECT_CONFIG;
  }
  const newConfig =
    typeof first === "string" ? configSet(current, first, second) : configMerge(current, first);
  console.log(newConfig);

  writeFileSync(currentDirectory(CONFIG_FILE), JSON.stringify(newConfig, null, 2), {
    encoding: "utf-8",
  });

  return newConfig as IProjectConfigFilled;
}

export { saveProjectConfig };

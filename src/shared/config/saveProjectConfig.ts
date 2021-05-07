import merge from "deepmerge";
import { writeFileSync } from "fs";
import { IDoConfig, IProjectConfig } from "~/@types";
import { currentDirectory } from "../file";
import { CONFIG_FILE, DEFAULT_PROJECT_CONFIG } from "./constants";
import { getProjectConfig } from "./getProjectConfig";

/**
 * **saveProjectConfig**
 *
 * updates the configuration stored in the current working directory
 */
export async function saveProjectConfig<
  T extends Partial<Omit<IDoConfig, "kind" | "userConfig" | "projectConfig">>
>(updated: T) {
  let current = getProjectConfig();
  if (!current.projectConfig) {
    current = DEFAULT_PROJECT_CONFIG;
  }
  const newConfig: IProjectConfig = {
    ...merge(current, updated),
    kind: "project",
    projectConfig: true,
  };

  writeFileSync(currentDirectory(CONFIG_FILE), JSON.stringify(newConfig, null, 2), {
    encoding: "utf-8",
  });

  return newConfig;
}

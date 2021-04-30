import merge from "deepmerge";
import { writeFileSync } from "fs";
import { IDoConfig, IProjectConfig } from "~/@types";
import { currentDirectory } from "../file";
import { CONFIG_FILE, DEFAULT_PROJECT_CONFIG } from "./constants";
import { getProjectConfig } from "./getProjectConfig";

/**
 * **saveUserConfig**
 *
 * updates the configuration to a _section_ which is either a command or to
 * the `general` section for shared meta-data. The value passed in is
 * deep copied with the current value to ensure it is non-destructive.
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
}

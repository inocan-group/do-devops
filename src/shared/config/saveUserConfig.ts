import merge from "deepmerge";
import { writeFileSync } from "fs";
import { IDoConfig, IUserConfig } from "~/@types";
import { getUserConfig } from "~/shared/config";
import { homeDirectory } from "~/shared/file";
import { CONFIG_FILE } from "./constants";

/**
 * **saveToUserConfig**
 *
 * updates the configuration to a _section_ which is either a command or to
 * the `general` section for shared meta-data. The value passed in is
 * deep copied with the current value to ensure it is non-destructive.
 */
export async function saveUserConfig<
  T extends Partial<Omit<IDoConfig, "kind" | "userConfig" | "projectConfig">>
>(updated: T) {
  let current = getUserConfig();
  if (!current.userConfig) {
    current = { kind: "user", userConfig: true, general: {}, aws: {} };
  }

  const newConfig: IUserConfig = { ...merge(current, updated), kind: "user", userConfig: true };

  writeFileSync(homeDirectory(CONFIG_FILE), JSON.stringify(newConfig, null, 2), {
    encoding: "utf-8",
  });
}

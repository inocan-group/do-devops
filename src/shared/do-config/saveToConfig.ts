import set = require("lodash.set");
import { getConfig, writeConfig } from "~/shared";

/**
 * saves a value to the configuration file
 *
 * @param path the path in the config to write to
 * @param value the value to set
 * @param projectOrUser 'project' or 'user'
 */
export async function saveToConfig(
  path: string,
  value: any,
  projectOrUser: "project" | "user"
) {
  // TODO: remove?
  // const filename = getConfigFilename(projectOrUser);
  const config = set(await getConfig(projectOrUser), path, value);

  writeConfig(config, projectOrUser);
}

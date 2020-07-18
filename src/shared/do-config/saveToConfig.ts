import set = require("lodash.set");
import { getConfig, getConfigFilename } from "../../shared";
import { writeConfig } from "../../shared";

/**
 * saves a value to the configuration file
 *
 * @param path the path in the config to write to
 * @param value the value to set
 * @param projectOrUser 'project' or 'user'
 */
export async function saveToConfig(path: string, value: any, projectOrUser: "project" | "user") {
  const filename = getConfigFilename(projectOrUser);
  const config = set(await getConfig(projectOrUser), path, value);
  console.log({ config });

  writeConfig(config, projectOrUser);
}

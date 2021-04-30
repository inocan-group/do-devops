import parse from "destr";
import { currentDirectory, readFile } from "~/shared/file";
import { IProjectConfig, IProjectConfigFilled } from "~/@types";
import { CONFIG_FILE } from "~/shared/config/constants";

/**
 * Gets the project's configuration from the current
 * directory.
 *
 * If not available on filesystem then it returns `IProjectConfigUnfilled`.
 */
export function getProjectConfig(): IProjectConfig {
  return (
    (parse(readFile(currentDirectory(CONFIG_FILE))) as IProjectConfigFilled | false) || {
      projectConfig: false,
      kind: "project",
    }
  );
}

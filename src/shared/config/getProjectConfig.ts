import parse from "destr";
import path from "path";
import { currentDirectory, readFile } from "~/shared/file";
import { IProjectConfig, IProjectConfigFilled } from "~/@types";
import { CONFIG_FILE } from "~/shared/config/constants";

/**
 * Gets the project's configuration from the current
 * directory.
 *
 * If not available on filesystem then it returns `IProjectConfigUnfilled`.
 */
export function getProjectConfig(offset?: string): IProjectConfig {
  const filename = path.join(currentDirectory(), offset || ".", CONFIG_FILE);

  return (
    (parse(readFile(filename)) as IProjectConfigFilled | false) || {
      projectConfig: false,
      kind: "project",
    }
  );
}

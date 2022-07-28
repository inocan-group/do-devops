import parse from "destr";
import path from "node:path";

import { IProjectConfig, IProjectConfigFilled } from "src/@types";
import { CONFIG_FILE } from "src/shared/config/constants";
import { currentDirectory } from "../file/base-paths/currentDirectory";
import { readFile } from "../file/crud/readFile";

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

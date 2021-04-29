import parse from "destr";
import { readFile } from "../file";
import { IProjectConfig, IProjectConfigFilled } from "~/@types";

/**
 * Gets the project's configuration from the current
 * directory.
 *
 * If not available on filesystem then it returns `IProjectConfigUnfilled`.
 */
export function getProjectConfig(): IProjectConfig {
  return (
    (parse(readFile("./.do-devops.json")) as IProjectConfigFilled | false) || {
      projectConfig: false,
      kind: "project",
    }
  );
}

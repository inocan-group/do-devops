import parse from "destr";
import { IUserConfig, IUserConfigFilled } from "~/@types";
import { readFile } from "../file";

/**
 * Gets the project's configuration from the current
 * directory.
 *
 * If not available on filesystem then it returns `IUserConfigUnfilled`.
 */
export function getUserConfig(): IUserConfig {
  return (
    (parse(readFile("~/.do-devops.json")) as IUserConfigFilled | false) || {
      userConfig: false,
      kind: "user",
    }
  );
}

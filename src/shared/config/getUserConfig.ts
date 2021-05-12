import parse from "destr";
import { IUserConfig, IUserConfigFilled } from "~/@types";
import { CONFIG_FILE } from "~/shared/config/constants";
import { homeDirectory, readFile } from "~/shared/file";

/**
 * **getUserConfig**
 *
 * Gets the user's configuration from their home
 * directory.
 */
export function getUserConfig(): IUserConfig {
  return (
    (parse(readFile(homeDirectory(CONFIG_FILE))) as IUserConfigFilled | false) || {
      userConfig: false,
      kind: "user",
    }
  );
}

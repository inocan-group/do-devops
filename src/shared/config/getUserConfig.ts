import parse from "destr";
import { IUserConfig, IUserConfigFilled } from "src/@types";
import { CONFIG_FILE } from "src/shared/config/constants";
import { homeDirectory } from "../file/base-paths/homeDirectory";
import { readFile } from "../file/crud/readFile";

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

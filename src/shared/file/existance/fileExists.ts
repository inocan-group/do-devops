import { existsSync } from "fs";
import { homedir } from "os";
import path from "path";
import { interpolateFilePath } from "~/shared/file/helpers";

/**
 * Checks for the existance of a file.
 *
 * > `~/` and `./` shorthands will be converted to a full path
 */
export function fileExists(file: string) {
  file = interpolateFilePath(file);
  if (file.slice(0, 1) === "~") {
    file = path.posix.join(homedir(), file.slice(1));
  }

  return existsSync(file);
}

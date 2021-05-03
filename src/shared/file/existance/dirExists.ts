import { existsSync, lstatSync } from "fs";
import { DevopsError } from "~/errors";
import { interpolateFilePath } from "~/shared/file/helpers";

/**
 * Checks for the existance of a directory and returns
 * a boolean flag.
 *
 * Errors:
 * - `dir/exists-not-dir`
 */
export function dirExists(dir: string, ignoreSymLink = false) {
  dir = interpolateFilePath(dir);

  const exists = existsSync(dir);
  if (!exists) {
    return false;
  }

  const info = lstatSync(dir);
  const isSymLink = info.isSymbolicLink();
  const isDirectory = info.isDirectory();
  if (!isDirectory) {
    throw new DevopsError(
      `The test to see if the path "${dir}" as a directory failed because that path exists but it is NOT a directory!`,
      "dir/exists-not-dir"
    );
  }

  return !isSymLink || ignoreSymLink;
}

import { existsSync, readFileSync } from "fs";

import { DevopsError } from "~/errors";
import path from "path";

/**
 * Returns the file contents of a file off of the user's home directory.
 *
 * @param filename the filename relative to the home directory
 * @param ignoreMissing if set to TRUE then no error is thrown when file is not found but instead the value `FALSE` is passed back
 */
export function getFileFromHomeDirectory(
  filename: string,
  ignoreMissing: boolean = false
) {
  const homedir = require("os").homedir();
  const fqName = path.join(homedir, filename);
  if (!existsSync(fqName)) {
    if (ignoreMissing) {
      return false;
    }
    throw new DevopsError(
      `Attempt to load the file "${filename}" from the user's home directory has failed as the file does not exist!`,
      "does-not-exist"
    );
  }

  return readFileSync(fqName, "utf-8");
}

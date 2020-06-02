import { existsSync, readFileSync } from "fs";

import { DevopsError } from "../errors";
import { join } from "path";

export function getFileFromHomeDirectory(filename: string, ignoreMissing: boolean = false) {
  const homedir = require("os").homedir();
  const fqName = join(homedir, filename);
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

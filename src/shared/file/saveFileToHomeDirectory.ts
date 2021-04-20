import { existsSync, writeFileSync } from "fs";

import { DevopsError } from "~/errors";
import { IDictionary } from "common-types";
import path from "path";

export function saveFileToHomeDirectory(
  filename: string,
  data: string | IDictionary,
  overwrite: boolean = true
) {
  const homedir = require("os").homedir();
  const fqName = path.join(homedir, filename);
  const allowWrite = overwrite || !existsSync(fqName);
  if (!allowWrite) {
    throw new DevopsError(
      `Attempt to write file "${filename}" to user's home directory will not be allowed as the file already exists!`,
      "not-allowed"
    );
  }

  writeFileSync(fqName, typeof data === "string" ? data : JSON.stringify(data));
}

import { existsSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "pathe";
import { DevopsError } from "src/errors";
import { IDictionary } from "common-types";

export function saveFileToHomeDirectory(
  filename: string,
  data: string | IDictionary,
  overwrite: boolean = true
) {
  const fqName = join(homedir(), filename);
  const allowWrite = overwrite || !existsSync(fqName);
  if (!allowWrite) {
    throw new DevopsError(
      `Attempt to write file "${filename}" to user's home directory will not be allowed as the file already exists!`,
      "not-allowed"
    );
  }

  writeFileSync(fqName, typeof data === "string" ? data : JSON.stringify(data));
}

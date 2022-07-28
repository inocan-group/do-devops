import { lstatSync, rmSync } from "node:fs";
import { DevopsError } from "src/errors";
import { fileExists } from "../existence/fileExists";
import { interpolateFilePath } from "../helpers/interpolateFilepath";

/**
 * Attempts to remove a file.
 *
 * Errors:
 * - `removal-failed/does-not-exist`
 * - `removal-failed/not-file`
 * - `removal-failed/other`
 *
 * Where possible, use the following functions to be explicit about the
 * base directory you are intending:
 *   - `libraryDirectory()`,
 *   - `homeDirectory()`,
 *   - `currentDirectory()`
 *
 * If, however, the filename starts with `src/` or `./` the appropriate base
 * will be deduced as well.
 */
export function removeFile(filename: string) {
  filename = interpolateFilePath(filename);
  if (!fileExists(filename)) {
    throw new DevopsError(
      `Attempt to remove a file -- ${filename} -- which does not exist!`,
      "removal-failed/does-not-exist"
    );
  }
  const stat = lstatSync(filename);
  if (!stat.isFile()) {
    throw new DevopsError(
      `Can not remove the file "${filename}" as it is not a file!`,
      "removal-failed/not-file"
    );
  }

  try {
    rmSync(filename);
  } catch (error) {
    throw new DevopsError(
      `Problem encountered trying to remove file "${filename}": ${(error as Error).message}`,
      "removal-failed/other"
    );
  }
}

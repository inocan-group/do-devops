import path from "node:path";
import { readdirSync, lstatSync } from "node:fs";
import { DevopsError } from "src/errors";

/**
 * Lists all subdirectories directly under the passed in path.
 */
export function getSubdirectories(dir: string) {
  try {
    const files = readdirSync(dir);

    return files.filter((f) => {
      const stats = lstatSync(path.posix.join(dir, f));
      return stats.isDirectory();
    });
  } catch (error) {
    throw new DevopsError(
      `Attempt to get files from the directory "${dir}" failed: ${(error as Error).message}`,
      "do-devops/directoryFiles"
    );
  }
}

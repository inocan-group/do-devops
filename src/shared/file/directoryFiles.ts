import { readdirSync, lstatSync } from "fs";
import path from "path";
import { IFileWithStats } from "~/@types";
import { DevopsError } from "~/errors";

/**
 * Returns all files in the specified directory along with their "stats".
 */
export function directoryFiles(dir: string): IFileWithStats[] {
  try {
    const files = readdirSync(dir);

    return files.reduce((agg: IFileWithStats[], file: string) => {
      const stats = lstatSync(path.posix.join(dir, file));
      agg.push({ file, stats });
      return agg;
    }, []);
  } catch (error) {
    throw new DevopsError(
      `Attempt to get files from the directory "${dir}" failed: ${error.message}`,
      "do-devops/directoryFiles"
    );
  }
}

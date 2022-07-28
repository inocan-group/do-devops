import { readdirSync, lstatSync } from "node:fs";
import path from "node:path";
import { IFileWithStats } from "src/@types";
import { DevopsError } from "src/errors";

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
      `Attempt to get files from the directory "${dir}" failed: ${(error as Error).message}`,
      "do-devops/directoryFiles"
    );
  }
}

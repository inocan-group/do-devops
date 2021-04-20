import { statSync, readdirSync } from "fs";
import path from "path";
import { IFileWithStats } from "~/@types";
import { DevopsError } from "~/errors";

/**
 * Returns all files in the specified directory along with their "stats".
 *
 * Note: _relative paths to the current working directory are assumed but you can
 * lead with the `/` character to indicate a full directory path_
 */
export function directoryFiles(dir: string): IFileWithStats[] {
  try {
    const fullDir = ["/", "\\"].includes(dir.slice(0, 1))
      ? dir
      : path.posix.join(process.cwd(), dir);
    const files = readdirSync(fullDir);
    return files.reduce((agg: IFileWithStats[], file: string) => {
      const stats = statSync(path.posix.join(process.cwd(), dir, file));
      agg.push({ file, stats });
      return agg;
    }, []);
  } catch (error) {
    throw new DevopsError(
      `Attempt to get files from the directory "${dir}" [ ${path.posix.join(
        process.cwd(),
        dir
      )} ] failed: ${error.message}`,
      "do-devops/directoryFiles"
    );
  }
}

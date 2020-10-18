import { statSync, readdirSync, Stats } from "fs";
import { posix } from "path";
import { DevopsError } from "../errors";

/**
 * Given a passed in _directory_, this function returns the files in that directory
 * as well as their "stats".
 *
 * Note: _relative_ paths to the current working directory are assumed but you can
 * lead with the `/` character to indicate a full directory path
 */
export function directoryFiles(dir: string) {
  try {
    const fullDir = ["/", "\\"].includes(dir.slice(0, 1)) ? dir : posix.join(process.cwd(), dir);
    const files = readdirSync(fullDir);
    return files.reduce((agg: [{ file: string; stats: Stats }], file: string) => {
      const stats = statSync(posix.join(process.cwd(), dir, file));
      return agg.concat({ file, stats });
    }, []);
  } catch (e) {
    throw new DevopsError(
      `Attempt to get files from the directory "${dir}" [ ${posix.join(
        process.cwd(),
        dir
      )} ] failed: ${e.message}`,
      "do-devops/directoryFiles"
    );
  }
}

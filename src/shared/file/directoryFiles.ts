import { statSync, readdirSync, Stats } from "fs";
import { join } from "path";
import { IDictionary } from "common-types";
import { DevopsError } from "../errors";

export function directoryFiles(dir: string) {
  try {
    const files = readdirSync(join(process.cwd(), dir));
    return files.reduce(
      (agg: [{ file: string; stats: Stats }], file: string) => {
        const stats = statSync(join(process.cwd(), dir, file));
        return agg.concat({ file, stats });
      },
      []
    );
  } catch (e) {
    throw new DevopsError(
      `Attempt to get files from the directory "${dir}" [ ${join(
        process.cwd(),
        dir
      )} ] failed: ${e.message}`,
      "do-devops/directoryFiles"
    );
  }
}

import { IDictionary } from "common-types";
import { writeFile } from "fs";
import { promisify } from "util";
import { DevopsError } from "../errors";
import { join } from "path";

const w = promisify(writeFile);

/**
 * **write**
 *
 * Writes a file to the filesystem; favoring files which are based off the repo's
 * root
 *
 * @param filename the filename to be written; if filename doesn't start with either a '.' or '/' then it will be joined with the projects current working directory
 * @param data the data to be written
 */
export async function write(
  filename: string,
  data: string | IDictionary,
  spacing: number = 2
) {
  try {
    if (typeof data !== "string") {
      data =
        spacing && spacing > 0
          ? JSON.stringify(data, null, spacing)
          : JSON.stringify(data);
    }
    if (![".", "/"].includes(filename.slice(0, 1))) {
      filename = join(process.cwd(), filename);
    }
    await w(filename, data, { encoding: "utf-8" });

    return { filename, data };
  } catch (e) {
    throw new DevopsError(
      `Problem writing file "${filename}": ${e.message}`,
      "do-devops/can-not-write"
    );
  }
}

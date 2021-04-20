import { IDictionary } from "common-types";
import path from "path";
import { writeFile } from "fs";
import { promisify } from "util";
import { DevopsError } from "~/errors";
import { filesExist } from "./filesExist";

const w = promisify(writeFile);

export interface IWriteOptions {
  spacing?: number;
  /**
   * if set to `true` it will add a numeric offset to the filename to avoid collisions
   */
  offsetIfExists?: boolean;
}

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
  options: IWriteOptions = {}
) {
  try {
    if (typeof data !== "string") {
      data =
        options.spacing && options.spacing > 0
          ? JSON.stringify(data, null, options.spacing)
          : JSON.stringify(data);
    }
    if (![".", "/"].includes(filename.slice(0, 1))) {
      filename = path.join(process.cwd(), filename);
    }
    let offset: number | undefined;
    while (options.offsetIfExists && filesExist(filename)) {
      const before = new RegExp(`-${offset}.(.*)$`);
      filename = offset ? filename.replace(before, ".$1") : filename;
      offset = !offset ? 1 : offset++;
      // const after = new RegExp(`-${offset}$`);
      const parts = filename.split(".");
      filename = parts.slice(0, -1).join(".") + `-${offset}.` + parts.slice(-1);
    }
    await w(filename, data, {
      encoding: "utf-8",
    });

    return { filename, data };
  } catch (error) {
    throw new DevopsError(
      `Problem writing file "${filename}": ${error.message}`,
      "do-devops/can-not-write"
    );
  }
}

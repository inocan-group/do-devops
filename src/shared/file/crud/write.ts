import { mkdirSync, writeFileSync } from "node:fs";
import { DevopsError } from "../../../errors/DevopsError";
import { dirExists, fileExists } from "../existence";
import { IWriteOptions } from "src/@types";
import { interpolateFilePath } from "../../../shared/file/helpers";
import chalk from "chalk";
import path from "node:path";
import { isClassification } from "../../../@type-guards";

/**
 * **write**
 *
 * Writes a file to the filesystem.
 *
 * **Errors:**
 * - `do-devops/file-exists`
 * - `do-devops/file-write-error`
 *
 * **Note:** _if the filename is prefixed with a_ `.`, `~`, _or_ `/` _then it will be considered a
 * full file path but in other cases it will always be offset from the current working
 * directory._
 */
export function write(filename: string, data: any, options: IWriteOptions = {}) {
  try {
    // get data into a string form
    const content =
      typeof data !== "string"
        ? options.pretty
          ? JSON.stringify(data, null, 2)
          : JSON.stringify(data)
        : data;

    filename = interpolateFilePath(filename);

    // avoid collisions if offset avoidence is enabled
    let offset: number | undefined;
    while (options.offsetIfExists && fileExists(filename)) {
      const before = new RegExp(`-${offset}.(.*)$`);
      filename = offset ? filename.replace(before, ".$1") : filename;
      offset = !offset ? 1 : offset++;
      // const after = new RegExp(`-${offset}$`);
      const parts = filename.split(".");
      filename = parts.slice(0, -1).join(".") + `-${offset}.` + parts.slice(-1);
    }

    if (!options.offsetIfExists && !options.allowOverwrite && fileExists(filename)) {
      throw new DevopsError(
        `The file "${filename}" already exists and the {italic overwrite} flag was not set. Write was not allowed.`,
        "do-devops/file-exists"
      );
    }

    if (!dirExists(path.dirname(filename))) {
      mkdirSync(path.dirname(filename), { recursive: true });
    }

    writeFileSync(filename, content, {
      encoding: "utf8",
    });

    return { filename, data };
  } catch (error) {
    if (isClassification(error, "do-devops/file-exists")) {
      throw error;
    }
    throw new DevopsError(
      `Problem writing file "${filename}": ${(error as Error).message}`,
      "do-devops/file-write-error"
    );
  }
}

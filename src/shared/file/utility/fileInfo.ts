import { stat } from "fs";
import path from "path";
import { promisify } from "util";
import { IFileInfo } from "~/@types/file-types";
import { DevopsError } from "~/errors";
import { getFileComponents } from ".";

const info = promisify(stat);

/**
 * Get's file info from an array of files (using Node's `stat` operation).
 *
 * @param files the list of files to **stat**. The files will automatically
 * be associated with the current working directory unless the filenames start
 * with a `/`.
 */
export async function fileInfo(...files: string[]): Promise<IFileInfo[]> {
  let rememberFile: string | undefined;
  try {
    const promises: Promise<IFileInfo>[] = [];
    for (const file of files.filter((i) => i)) {
      const parts = getFileComponents(file);
      promises.push(
        info(file).then((s) => {
          return { ...parts, ...s };
        })
      );
    }

    const results = await Promise.all(promises);

    return results;
  } catch (error) {
    throw new DevopsError(
      `Attempt to get info/stat from the file "${rememberFile}" [ ${path.join(
        process.cwd(),
        rememberFile || ""
      )} ] failed [ call included request for ${files.length} files ]: ${(error as Error).message}`,
      "do-devops/filesInfo"
    );
  }
}
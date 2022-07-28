import { DevopsError } from "src/errors";
import { readFile } from "src/shared/file";

/**
 * Looks at the contents of a file and then returns a boolean flag to indicate whether
 * all of the strings found in `lookFor` params were found in that file.
 *
 * Errors:
 * - `file/file-does-not-exist`
 * - `file/file-is-empty`
 */
export function fileIncludes(filename: string, ...lookFor: string[]) {
  const content = readFile(filename);
  if (content === undefined) {
    throw new DevopsError(`The file "${filename}" does not exist!`, "file/file-does-not-exist");
  }
  let result = true;

  for (const text of lookFor) {
    if (!content.includes(text)) {
      result = false;
      console.log("false result:", filename);
    }
  }

  return result;
}

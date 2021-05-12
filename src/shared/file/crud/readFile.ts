import { readFileSync } from "fs";
import { filesExist } from "../existance/filesExist";
import { interpolateFilePath } from "../helpers";

/**
 * Reads a file from the filesystem and returns as a string.
 *
 * Errors:
 *  - `read-file/unknown`
 *  - _if the file doesn't exist, will return_ `undefined`
 *
 * Where possible, use the following functions to be explicit about the
 * base directory you are intending:
 *   - `libraryDirectory()`,
 *   - `homeDirectory()`,
 *   - `currentDirectory()`
 *
 * If, however, the filename starts with `~/` or `./` the appropriate base
 * will be deduced as well.
 */
export function readFile(filename: string) {
  filename = interpolateFilePath(filename);

  return filesExist(filename) ? readFileSync(filename, { encoding: "utf-8" }) : undefined;
}

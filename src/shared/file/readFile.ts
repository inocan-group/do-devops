import { readFileSync } from "fs";
import { filesExist } from "./filesExist";
import { interpolateFilePath } from "./interpolateFilepath";

/**
 * Reads a file from the filesystem and returns as a string.
 *
 * If the filename is prefixed with `~/` it will resolve to
 * user's home directory, if prefixed with a `./` it will
 * ensure current working directory.
 *
 * Note: if the file doesn't exist it will return `false`
 */
export function readFile(filename: string) {
  filename = interpolateFilePath(filename);

  return filesExist(filename) ? readFileSync(filename, { encoding: "utf-8" }) : false;
}

import { readFileSync } from "fs";
import { filesExist } from "./filesExist";

/**
 * Reads a file from the filesystem and returns as a string.
 *
 * Note: if the file doesn't exist it will return `false`
 */
export function readFile(filename: string) {
  return filesExist(filename) ? readFileSync(filename, { encoding: "utf-8" }) : false;
}

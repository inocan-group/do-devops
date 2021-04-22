import * as fs from "fs";
import { promisify } from "util";
const read = promisify(fs.readFile);

/**
 * Reads a file in a file and returns the contens as
 * a string.
 */
export async function readFile(filename: string) {
  const contents = await read(filename, { encoding: "utf-8" });

  return contents;
}

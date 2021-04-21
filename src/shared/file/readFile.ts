import * as fs from "fs";
import { promisify } from "util";
const read = promisify(fs.readFile);

export async function readFile(filename: string) {
  const contents = await read(filename, { encoding: "utf-8" });

  return contents;
}

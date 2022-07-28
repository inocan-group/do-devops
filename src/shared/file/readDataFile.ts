import path from "node:path";
import * as process from "node:process";
import { readFile } from "src/shared/file";

/**
 * Reads a file from the `test/data` directory
 */
export async function readDataFile(file: string, defaultExtension?: string) {
  if (defaultExtension && defaultExtension.slice(0, 1) === ".") {
    defaultExtension = defaultExtension.slice(1);
  }

  let filename = path.join(process.cwd(), "test/data", file);

  if (defaultExtension && !file.includes("." + defaultExtension)) {
    filename += "." + defaultExtension;
  }
  return readFile(filename);
}

import * as path from "path";
import * as process from "process";
import { readFile } from "./index";

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

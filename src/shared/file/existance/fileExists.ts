import { existsSync } from "node:fs";
import { interpolateFilePath } from "../helpers";

/**
 * Checks for the existence of a file.
 *
 * > `~/` and `./` shorthands will be converted to a full path
 */
export function fileExists(file: string) {
  try {
    const f = interpolateFilePath(file);

    return existsSync(f);
  } catch {
    return false;
  }
}

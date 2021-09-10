import * as fs from "fs";
import { promisify } from "util";
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

/**
 * Makes sure that the given directory exists and if not then it creates it.
 *
 * Note: _return value is `true` if the directory had to be created; otherwise returns
 * `undefined`._
 */
export async function ensureDirectory(dir: string): Promise<true | undefined> {
  const doesExist = await exists(dir);
  if (!doesExist) {
    await mkdir(dir, { recursive: true });
    return true;
  }

  return;
}

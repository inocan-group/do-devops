import * as fs from "fs";
import { promisify } from "util";
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

/**
 * Makes sure that the given directory exists and if not then it creates it
 */
export async function ensureDirectory(dir: string) {
  const doesExist = await exists(dir);
  if (!doesExist) {
    await mkdir(dir, { recursive: true });
  }
}

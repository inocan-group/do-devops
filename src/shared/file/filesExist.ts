import { existsSync } from "fs";
import { join } from "path";

/**
 * Checks all the files to see if they exist in the file system.
 * If none do then it returns false, if some do then it returns
 * an array of those which _do_ exist.
 *
 * @param files the files to be checked for existance
 */
export function filesExist(...files: string[]) {
  const exists: string[] = [];
  files.forEach(f => {
    if (![".", "/"].includes(f.slice(0, 1))) {
      f = join(process.cwd(), f);
    }
    if (existsSync(f)) {
      exists.push(f);
    }
  });

  return exists.length > 0 ? exists : false;
}

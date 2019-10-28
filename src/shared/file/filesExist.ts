import { exists } from "fs";
import { promisify } from "util";
import { join } from "path";

const existance = promisify(exists);

/**
 * Checks all the files to see if they exist in the file system.
 * If none do then it returns false, if some do then it returns
 * an array of those which _do_ exist.
 *
 * @param files the files to be checked for existance
 */
export async function filesExist(...files: string[]) {
  const exists: string[] = [];
  const promises: Promise<any>[] = [];
  files.forEach(f => {
    if (![".", "/"].includes(f.slice(0, 1))) {
      f = join(process.cwd(), f);
    }
    promises.push(existance(f).then(i => (i ? exists.push(f) : null)));
  });
  await Promise.all(promises);

  return exists.length > 0 ? exists : false;
}

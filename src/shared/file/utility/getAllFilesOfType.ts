import { globbySync as sync } from "globby";
import path from "pathe";

/**
 * Returns a list of files of a particular type/extention. This list of files will
 * originate off of the `src` directory or whatever directory you state as the `dir`.
 *
 * @param type the type/extension of the file you are looking for
 * @param dir the directory to look in; by default will look in `src` off the repo's roote
 */
export function getAllFilesOfType(type: string, dir: string = "src") {
  const directory = dir.slice(0, 1) === "/" ? dir : path.join(process.cwd(), dir);
  return sync([`${directory}/**/*.${type}`]);
}

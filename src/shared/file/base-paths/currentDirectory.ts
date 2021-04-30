/* eslint-disable unicorn/prefer-module */
import path from "path";

/**
 * Returns a file/directory name prefixed by _current working
 * directory_ which it is being executed in.
 */
export function currentDirectory(offset: string = "") {
  const base = process.cwd();
  // just to be sure; remove path to homedir if it already exists
  offset = offset.replace(base, "");

  return path.posix.join(base, offset);
}

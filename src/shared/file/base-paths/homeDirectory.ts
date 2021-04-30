/* eslint-disable unicorn/prefer-module */
import path from "path";
import { homedir } from "os";

/**
 * Returns a file/directory name prefixed by user's _home directory_
 */
export function homeDirectory(offset: string = "") {
  const home = homedir();
  // just to be sure; remove path to homedir if it already exists
  offset = offset.replace(home, "");

  return path.posix.join(home, offset);
}

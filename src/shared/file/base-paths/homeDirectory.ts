import path from "path";
import { homedir } from "os";
import { IDirectoryOptions } from "~/@types";
import { toRelativePath } from "../relativePath";

/**
 * Returns a file/directory name prefixed by user's _home directory_.
 *
 * Note: where an offset is used
 */
export function homeDirectory(opts: IDirectoryOptions = {}) {
  const home = opts.offset ? path.posix.join(homedir(), opts.offset) : homedir();

  return opts.base ? toRelativePath(home, opts.base) : home;
}

import path from "path";
import { homedir } from "os";
import { IDirectoryOptions } from "~/@types";
import { toRelativePath } from "../relativePath";

/**
 * Returns a file/directory name prefixed by user's _home directory_
 */
export function homeDirectory(opts: IDirectoryOptions = {}) {
  const home = opts.offset ? path.posix.join(opts.offset, homedir()) : homedir();

  return opts.base ? toRelativePath(home, opts.base) : home;
}

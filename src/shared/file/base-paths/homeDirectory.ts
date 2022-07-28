import path from "node:path";
import { homedir } from "node:os";
import { IDirectoryOptions } from "src/@types";
import { toRelativePath } from "../relativePath";

/**
 * Returns a file/directory name prefixed by user's _home directory_.
 *
 * Note: where an offset is used
 */
export function homeDirectory(offset?: string, opts: IDirectoryOptions = {}) {
  const home = offset ? path.posix.join(homedir(), offset) : homedir();

  return opts.base ? toRelativePath(home, opts.base) : home;
}

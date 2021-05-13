/* eslint-disable unicorn/prefer-module */
import path from "path";
import { IDirectoryOptions } from "~/@types";
import { toRelativePath } from "../relativePath";

/**
 * Returns a file/directory name prefixed by the root of the `do-devops`
 * library directory which it is being executed in.
 */
export function libraryDirectory(offset?: string, opts: Omit<IDirectoryOptions, "offset"> = {}) {
  const base = __filename.replace(/(\/(do-devops|dd)\/).*/, "$1");
  const dir = offset ? path.posix.join(base, offset) : base;

  return opts.base ? toRelativePath(dir, opts.base) : dir;
}

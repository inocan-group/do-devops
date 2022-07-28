/* eslint-disable unicorn/prefer-module */
import path from "node:path";
import { IDirectoryOptions } from "src/@types";
import { toRelativePath } from "../relativePath";

/**
 * Returns a file/directory name prefixed by _current working
 * directory_ which it is being executed in.
 */
export function currentDirectory(offset?: string, opts: Omit<IDirectoryOptions, "offset"> = {}) {
  const base = offset ? path.posix.join(process.cwd(), offset) : process.cwd();

  return opts.base ? toRelativePath(base, opts.base) : base;
}

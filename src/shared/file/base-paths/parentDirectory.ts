/* eslint-disable unicorn/prefer-module */
import path from "path";
import { IDirectoryOptions } from "~/@types";
import { toRelativePath } from "../relativePath";

/**
 * Returns the _parent_ directory of the current working directory.
 */
export function parentDirectory(offset?: string, opts: Omit<IDirectoryOptions, "offset"> = {}) {
  const cwd = path.posix.join(process.cwd(), "../");
  const base = offset ? path.posix.join(cwd, offset) : cwd;

  return opts.base ? toRelativePath(base, opts.base) : base;
}

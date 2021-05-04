/* eslint-disable unicorn/prefer-module */
import path from "path";
import { IDirectoryOptions } from "~/@types";
import { toRelativePath } from "../relativePath";
import { DevopsError } from "~/errors";
import { getCaller } from "~/shared/stack";

/**
 * Returns the directory name of the currently executing
 * script.
 */
export function executionDirectory(opts: IDirectoryOptions = {}) {
  const caller = getCaller();

  if (!caller.filePath) {
    throw new DevopsError(`Could not determine execution directory`, "file/unexpected");
  }
  const dir = opts.offset ? path.posix.join(caller.filePath, opts.offset) : caller.filePath;

  return opts.base ? toRelativePath(dir, opts.base) : dir;
}

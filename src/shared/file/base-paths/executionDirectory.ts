/* eslint-disable unicorn/prefer-module */
import path from "node:path";
import { IDirectoryOptions } from "src/@types";
import { toRelativePath } from "../relativePath";
import { DevopsError } from "src/errors";
import { getCaller } from "src/shared/stack";

/**
 * Returns the directory name of the currently executing
 * script.
 */
export function executionDirectory(offset?: string, opts: IDirectoryOptions = {}) {
  const caller = getCaller();

  if (!caller.filePath) {
    throw new DevopsError(`Could not determine execution directory`, "file/unexpected");
  }
  const dir = offset ? path.posix.join(caller.filePath, offset) : caller.filePath;

  return opts.base ? toRelativePath(dir, opts.base) : dir;
}

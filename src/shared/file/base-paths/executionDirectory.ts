/* eslint-disable unicorn/prefer-module */
import path from "path";
import { IDirectoryOptions } from "~/@types";
import callsites from "callsites";
import { toRelativePath } from "../relativePath";
import { DevopsError } from "~/errors";

/**
 * Returns the directory name of the currently executing
 * script.
 */
export function executionDirectory(opts: IDirectoryOptions = {}) {
  const c = callsites()[1].getFileName();
  if (!c) {
    throw new DevopsError(`Could not determine execution directory`, "file/unexpected");
  }
  const dir = opts.offset ? path.posix.join(c, opts.offset) : c;

  return opts.base ? toRelativePath(c, opts.base) : dir;
}

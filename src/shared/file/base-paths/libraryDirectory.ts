/* eslint-disable unicorn/prefer-module */
import {join} from "pathe";
import { IDirectoryOptions } from "src/@types";
import { toRelativePath } from "../relativePath";
import { fileURLToPath } from "node:url";

/**
 * Returns a file/directory name prefixed by the root of the `do-devops`
 * library directory which it is being executed in.
 */
export function libraryDirectory(offset?: string, opts: Omit<IDirectoryOptions, "offset"> = {}) {
  
  const base = fileURLToPath(new URL(".", import.meta.url)).replace("bin/", "");
  const dir = offset ? join(base, offset) : base;

  return opts.base ? toRelativePath(dir, opts.base) : dir;
}

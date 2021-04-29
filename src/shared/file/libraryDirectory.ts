/* eslint-disable unicorn/prefer-module */
import path from "path";

/**
 * Returns a file/directory name prefixed by the root of the `do-devops`
 * library directory which it is being executed in.
 */
export function libraryDirectory(offset: string = "") {
  const base = __filename.replace(/(\/do-devops\/).*/, "$1");

  return path.posix.join(base, offset);
}

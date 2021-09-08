import { findUpSync } from "find-up";
import { parentDirectory } from "~/shared/file";

/**
 * Finds the closest `package.json` file starting from the _parent_ of the current working
 * directory. If you prefer to start in a different location you can pass
 * in the starting directory to look in.
 */
export function findPackageJson(dir?: string) {
  return findUpSync("package.json", { cwd: dir || parentDirectory() });
}

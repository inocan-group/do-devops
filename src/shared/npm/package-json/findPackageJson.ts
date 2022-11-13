import { findUpSync as sync } from "find-up";
import { parentDirectory } from "src/shared/file";

/**
 * Finds the closest `package.json` file starting from the _parent_ of the current working
 * directory. If you prefer to start in a different location you can pass
 * in the starting directory to look in.
 */
export function findPackageJson(dir?: string) {
  return sync("package.json", { cwd: dir || parentDirectory() });
}

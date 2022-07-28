import { PackageManagerObservation } from "src/@types";
import { currentDirectory, fileExists, removeFile } from "src/shared/file";
import { PACKAGE_MANAGERS, PKG_MGR_LOCK_FILE_LOOKUP } from "./pm-constants";

/**
 * Removes the lock files for the "other" package managers.
 *
 * @returns an array of files removed
 */
export async function removeOtherLockFiles(
  pkgMgr: Exclude<PackageManagerObservation, "packageManagerConflict">
): Promise<string[]> {
  const toRemove = PACKAGE_MANAGERS.filter((i) => i !== pkgMgr);
  const files: string[] = [];

  for (const mngr of toRemove) {
    const file = PKG_MGR_LOCK_FILE_LOOKUP[mngr];
    const filepath = currentDirectory(file);
    if (fileExists(filepath)) {
      files.push(file);
      removeFile(filepath);
    }
  }

  return files;
}

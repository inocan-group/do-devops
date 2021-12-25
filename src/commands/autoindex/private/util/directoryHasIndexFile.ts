import path from "path";
import { isAutoindexFile } from "./isAutoindexFile";
import { isOrphanedIndexFile } from "./isOrphanedIndexFile";

/**
 * Determines whether a given directory has an autoindex file servicing it
 * which is not "orphaned"
 */
export function directoryHasNonOrphanedIndexFile(dir: string, indexFiles: string[]) {
  return !indexFiles.every(
    (f) =>
      path.posix.dirname(dir) === path.posix.dirname(f) &&
      isAutoindexFile(path.posix.join(f, "/index.ts")) &&
      !isOrphanedIndexFile(path.posix.join(f, "/index.ts"))
  );
}

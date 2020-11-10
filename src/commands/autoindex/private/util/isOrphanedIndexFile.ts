import { readFileSync } from "fs";

/**
 * Returns a boolean flag indicating whether the file is an
 * "orphaned" index file (e.g., index files below it in the
 * directory structure should ignore it)
 *
 * @param filename the filename to be tested
 */
export function isOrphanedIndexFile(filename: string) {
  return /^\/\/\s*#autoindex.*orphan/.test(readFileSync(filename, "utf-8"));
}

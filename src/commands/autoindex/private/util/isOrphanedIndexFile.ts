/**
 * Returns a boolean flag indicating whether the file is an
 * "orphaned" index file (e.g., index files below it in the
 * directory structure should ignore it)
 *
 * @param indexFileContents the filename to be tested
 */
export function isOrphanedIndexFile(indexFileContents: string) {
  const re = /\/\/\s*#\s*autoindex.+orphan/m;
  return re.test(indexFileContents);
}

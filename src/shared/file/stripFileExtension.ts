/**
 * Given a file or path and file, it strips off the
 * file's extension.
 */
export function stripFileExtension(filepath: string) {
  const re = new RegExp("(.*).[^.]+?$");
  return filepath.replace(re, "$1");
}

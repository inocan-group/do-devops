/**
 * Given a file or path and file, it strips off the
 * file's extension. Because extensions are typically
 * no longer than 4 characters this is built into the
 * criteria but you can override this default.
 */
export function stripFileExtension(filepath: string, extMaxLength: number = 4) {
  const re = new RegExp(`(.*)\.[^.]+?$`);
  return filepath.replace(re, "$1");
}

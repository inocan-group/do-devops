/**
 * reduces an absolute path to a relative path to the project root or optionally
 * the project root _offset_ by the `offset` property
 *
 * @param path the absolute path
 */
export function relativePath(path: string) {
  return path.replace(process.cwd(), "").replace(/^\//, "");
}

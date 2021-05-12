/**
 * **toRelativePath**
 *
 * Reduces an absolute path to a relative path to the project root or optionally
 * the project root _offset_ by the `offset` property
 */
export function toRelativePath(path: string, base?: string) {
  return path.replace(base || process.cwd(), "").replace(/^\//, "");
}

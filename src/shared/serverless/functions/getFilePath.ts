/**
 * **getFilePath**
 *
 * given a filepath, this function strips off the filename and returns just
 * the path which the file resides in.
 */
export function getFilePath(filePath: string) {
  const parts = filePath.split("/");
  return parts.slice(0, -1).join("/");
}

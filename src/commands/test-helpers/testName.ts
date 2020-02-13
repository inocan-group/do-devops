/**
 * Given a test file, return the name of the file without
 * the file extension and any file path that preceeds the file
 */
export function testName(testFile: string, pattern: string) {
  pattern = pattern.replace("**/*", "");
  const name: string = testFile
    .split("/")
    .pop()
    .replace(pattern, "");
  return name;
}

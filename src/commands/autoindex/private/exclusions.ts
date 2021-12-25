/**
 * returns the explicitly excluded files/directory names that are stated on a given file
 */
export function exclusions(indexFileContent: string): string[] {
  const hasExclusions = /^\/\/\s*#autoindex.*,\s*exclude:/;
  return hasExclusions.test(indexFileContent)
    ? indexFileContent
        .replace(/^\/\/\s*#autoindex.*,\s*exclude:([^\n;|]*)[\n;|][^\0]*/g, "$1")
        .split(",")
        .map((i) => i.trim())
    : [];
}

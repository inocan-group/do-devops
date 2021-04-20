/**
 * returns the explicitly excluded files/directory names that are stated on a given file
 */
export function exclusions(file: string): string[] {
  const hasExclusions = /^\/\/\s*#autoindex.*,\s*exclude:/;
  const explicit = hasExclusions.test(file)
    ? file
        .replace(/^\/\/\s*#autoindex.*,\s*exclude:([^\n;|]*)[\n;|][^\0]*/g, "$1")
        .split(",")
        .map((i) => i.trim())
    : [];
  return [...new Set([...explicit, "index", "private"])];
}

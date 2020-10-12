/**
 * returns the explicitly excluded files/directory names that are stated on a given file
 */
export function exclusions(file: string): string[] {
  const hasExclusions = /^\/\/\s*#autoindex.*,\s*exclude:/;
  const explicit = hasExclusions.test(file)
    ? file
        .replace(/[^\0]*exclude:([^;|\n]*)[\n|;][^\0]*/g, "$1")
        .split(",")
        .map((i) => i.trim())
    : [];
  return Array.from(new Set(explicit.concat(["index", "private"])));
}

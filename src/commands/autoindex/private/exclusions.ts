export function exclusions(file: string): string[] {
  return file.includes("exclude:")
    ? file
        .replace(/[^\0]*exclude:([^;|\n]*)[\n|;][^\0]*/g, "$1")
        .split(",")
        .map((i) => i.trim())
    : [];
}

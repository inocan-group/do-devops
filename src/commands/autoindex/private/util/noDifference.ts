export function noDifference(existing: string[], current: string[]) {
  return existing.every((v) => current.includes(v)) && current.every((v) => existing.includes(v));
}

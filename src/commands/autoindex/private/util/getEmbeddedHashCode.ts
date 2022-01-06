export function getEmbeddedHashCode(indexFileContent: string): string | undefined {
  const re = /hash-code: (\S*)/m;
  const matches = indexFileContent.match(re);
  return Array.isArray(matches) ? String(matches[1]) : undefined;
}

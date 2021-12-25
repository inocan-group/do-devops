export function getEmbeddedHashCode(indexFileContent: string): number | undefined {
  const re = /hash-code: (\S*)/m;
  const matches = indexFileContent.match(re);
  return Array.isArray(matches) ? Number(matches[1]) : undefined;
}

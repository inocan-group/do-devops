export async function convertStale(rules: IImageRule[]) {
  const { missing, outOfDate } = await checkCacheFreshness(cache, baseDir, globPattern);
  await refreshCache(cache, [...missing, ...outOfDate]);
}

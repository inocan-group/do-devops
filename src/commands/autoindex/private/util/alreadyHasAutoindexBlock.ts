const START_REGION = /\/\/ #region auto-{0,1}indexed files/gs;
const END_REGION = /\/\/ #endregion auto-{0,1}indexed files/gs;

/** indicates whether the given file already has a index region defined */
export function alreadyHasAutoindexBlock(fileContent: string) {
  return START_REGION.test(fileContent) && END_REGION.test(fileContent);
}

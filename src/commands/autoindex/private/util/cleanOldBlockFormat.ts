/**
 * The _old_ block was structured as `//#region` but this is not considered good
 * form by many linters so we've moved to `// #region` instead. This makes sure
 * the old block style has been removed.
 */
export function cleanOldBlockFormat(fileContents: string) {
  return fileContents.replace(/\/\/#region.*\/\/#endregion/s, "");
}

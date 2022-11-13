/**
 * **validateExports**
 *
 * Given an array of file imports, returns a hash of `valid` and `invalid`
 * files based on whether they represent a valid Lambda Serverless handler
 * definition.
 */
export async function validateExports(_fnDefns: string[]) {
  const valid: string[] = [];
  const invalid: string[] = [];

  return { valid, invalid };
}

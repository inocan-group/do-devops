/**
 * **validateExports**
 *
 * Given an array of file imports, returns a hash of `valid` and `invalid`
 * files based on whether they represent a valid Lambda Serverless handler
 * definition.
 */
export async function validateExports(fnDefns: string[]) {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const fn of fnDefns) {
    try {
      const imp = await import(fn);
      if (imp.default && Object.keys(imp.default).includes("handler")) {
        valid.push(fn);
      } else {
        invalid.push(fn);
      }
    } catch {
      invalid.push(fn);
    }
  }

  return { valid, invalid };
}

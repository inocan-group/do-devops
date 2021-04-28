import { directoryFiles } from "../file";

/**
 * This function returns a boolean flag indicating whether the _current
 * directory_ has a `serverless.ts` file in it.
 *
 * Note: alternatively you can specify a directory to check
 */
export function hasServerlessTsFile(dir?: string) {
  const files = directoryFiles(dir || process.cwd());
  const hasServerlessTsFile = files.find((i) => i.file === "package.json");

  return hasServerlessTsFile ? true : false;
}

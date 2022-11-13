/* eslint-disable unicorn/no-await-expression-member */
import { globby } from "globby";
import { dirname } from "pathe";
import { getPackageJson } from "../npm";

export type IMonoRepoPackages = {
  name: string;
  path: string;
};

/**
 * Gets all subdirectories which have a `package.json` and
 * are assumed to be distinct packages.
 */
export async function getMonoRepoPackages(
  baseDir?: string,
  exclude: string[] = []
): Promise<IMonoRepoPackages[]> {
  const glob = ["**/package.json", "!**/node_modules"];

  return (await globby(glob, { cwd: baseDir, deep: 10 }))
    .map((i) => {
      return {
        name: getPackageJson(i).name || "unknown",
        path: dirname(i),
      } as IMonoRepoPackages;
    })
    .filter((i) => i.path !== ".")
    .filter((i) => !exclude.includes(i.name));
}

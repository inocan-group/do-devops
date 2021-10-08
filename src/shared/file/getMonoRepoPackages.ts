import globby from "globby";
import { dirname } from "path";
import { getPackageJson } from "../npm";

export type IMonoRepoPackages = {
  name: string;
  path: string;
};

/**
 * Gets all subdirectories which have a `package.json` and
 * are assumed to be distinct packages.
 */
export async function getMonoRepoPackages(baseDir?: string): Promise<IMonoRepoPackages[]> {
  const glob = ["**/package.json", "!**/node_modules"];

  return (await globby(glob, { cwd: baseDir, deep: 10 }))
    .map((i) => {
      return {
        name: getPackageJson(i).name,
        path: dirname(i),
      } as IMonoRepoPackages;
    })
    .filter((i) => i.path !== ".");
}

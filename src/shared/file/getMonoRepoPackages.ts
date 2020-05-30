import * as globby from "globby";

import { existsSync, readdirSync } from "fs";

import { join } from "path";

/**
 * Gives back a list of packages in the monorepo. If the
 * "packages" directory does not exist then it will return
 * `false`, if there _is_ a packages directory but no sub-directories
 * you'll just get an empty array.
 */
export function getMonoRepoPackages(baseDir: string) {
  const dir = join(baseDir, "packages");
  if (!existsSync(dir)) {
    return false;
  }

  return readdirSync(dir, { withFileTypes: true })
    .filter((i) => i.isDirectory())
    .map((i) => i.name);
}

import fs from "fs";
import path from "path";
import parse from "destr";
import { IPackageJson } from "common-types";
import { getPackageJsonfromCache, cacheLocalPackageJson } from "./cache/packageJsonCache";
import { DevopsError } from "~/errors";

/**
 * **getPackageJson**
 *
 * Returns the `package.json` of the local repo as a typed object, if the file
 * doesn't exist in the CWD -- or passed in override -- then it will return
 * `false`.
 *
 * Note: _will put this file into a saved cache for other package json operations
 * (which is only in memory, not persisted); similarly it will look for all requests
 * in cache before file or network operations_
 */
export function getPackageJson(pathOverride?: string): IPackageJson {
  // look in cache first
  if (getPackageJsonfromCache()) {
    const p = getPackageJsonfromCache();
    return p as IPackageJson;
  }
  const filename = path.join(
    pathOverride?.replace("package.json", "") || process.cwd(),
    "package.json"
  );

  if (!fs.existsSync(filename)) {
    throw new DevopsError(
      `Attempt to get package.json [${filename}] file failed`,
      "not-ready/missing-package-json"
    );
  }

  const pj = parse(fs.readFileSync(filename, { encoding: "utf-8" })) as IPackageJson;
  cacheLocalPackageJson(pj);
  return pj;
}

import fs from "node:fs";
import path from "node:path";
import parse from "destr";
import { IPackageJson } from "common-types";
import { getPackageJsonfromCache, cacheLocalPackageJson } from "./cache/packageJsonCache";
import { DevopsError } from "src/errors";
import { fileExists } from "src/shared/file";

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
export function getPackageJson(pathOverride?: string, force: boolean = false): IPackageJson {
  // look in cache first
  const p = !force ? getPackageJsonfromCache(pathOverride) : undefined;
  if (p) {
    return p as IPackageJson;
  }

  const filename = path.join(
    pathOverride?.replace("package.json", "") || process.cwd(),
    "package.json"
  );

  if (!fileExists(filename)) {
    throw new DevopsError(
      `Attempt to get package.json [${filename}] file failed`,
      "not-ready/missing-package-json"
    );
  }

  const pj = parse(fs.readFileSync(filename, { encoding: "utf-8" })) as IPackageJson;
  cacheLocalPackageJson(pj, pathOverride);
  return pj;
}

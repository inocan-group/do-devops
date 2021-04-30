import { IPackageJson, IDictionary } from "common-types";

/**
 * Allows the packageJson (for the local repo)
 * to be cashed so there is no need to continue
 * to reload it in a single execution
 */
let packageJson: IPackageJson;
const pathBasedPackageJson: IDictionary<IPackageJson> = {};

export function getPackageJsonfromCache(overridePath?: string) {
  return overridePath
    ? pathBasedPackageJson[overridePath] || false
    : packageJson
    ? packageJson
    : false;
}

export function cacheLocalPackageJson(pkgJson: IPackageJson, pathOverride?: string) {
  if (pathOverride) {
    pathBasedPackageJson[pathOverride] = pkgJson;
  } else {
    packageJson = pkgJson;
  }
}

/**
 * Allows caching of remote package.json repos
 */
const remotePackageJsons: IDictionary<IPackageJson> = {};

export function getRemotePackageJson(repo: string) {
  return remotePackageJsons[repo] ? remotePackageJsons[repo] : false;
}

export function cacheRemotePackageJson(repo: string, pkgJson: IPackageJson) {
  remotePackageJsons[repo] = pkgJson;
}

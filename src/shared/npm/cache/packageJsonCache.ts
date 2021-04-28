import { IPackageJson, IDictionary } from "common-types";

/**
 * Allows the packageJson (for the local repo)
 * to be cashed so there is no need to continue
 * to reload it in a single execution
 */
let packageJson: IPackageJson;

export function getPackageJsonfromCache() {
  return packageJson ? packageJson : false;
}

export function cacheLocalPackageJson(pkgJson: IPackageJson) {
  packageJson = pkgJson;
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

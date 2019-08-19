import { IPackageJson, IDictionary } from "common-types";

/**
 * Allows the packageJson (for the local repo)
 * to be cashed so there is no need to continue
 * to reload it in a single execution
 */
let packageJson: IPackageJson;

export function getLocalPackageJson() {
  return packageJson ? packageJson : false;
}

export function saveLocalPackageJson(pkgJson: IPackageJson) {
  packageJson = pkgJson;
}

/**
 * Allows caching of remote package.json repos
 */
let remotePackageJsons: IDictionary<IPackageJson> = {};

export function getRemotePackageJson(repo: string) {
  return remotePackageJsons[repo] ? remotePackageJsons[repo] : false;
}

export function saveRemotePackageJson(repo: string, pkgJson: IPackageJson) {
  remotePackageJsons[repo] = pkgJson;
}

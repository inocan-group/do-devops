"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRemotePackageJson = exports.getRemotePackageJson = exports.saveLocalPackageJson = exports.getLocalPackageJson = void 0;
/**
 * Allows the packageJson (for the local repo)
 * to be cashed so there is no need to continue
 * to reload it in a single execution
 */
let packageJson;
function getLocalPackageJson() {
    return packageJson ? packageJson : false;
}
exports.getLocalPackageJson = getLocalPackageJson;
function saveLocalPackageJson(pkgJson) {
    packageJson = pkgJson;
}
exports.saveLocalPackageJson = saveLocalPackageJson;
/**
 * Allows caching of remote package.json repos
 */
let remotePackageJsons = {};
function getRemotePackageJson(repo) {
    return remotePackageJsons[repo] ? remotePackageJsons[repo] : false;
}
exports.getRemotePackageJson = getRemotePackageJson;
function saveRemotePackageJson(repo, pkgJson) {
    remotePackageJsons[repo] = pkgJson;
}
exports.saveRemotePackageJson = saveRemotePackageJson;

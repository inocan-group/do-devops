import { IPackageJson } from "common-types";
import { getPackageJson } from "./index";

let _devDeps: IPackageJson["devDependencies"];

export function hasDevDependency(dep: string, pathOveride?: string) {
  const devDeps = _devDeps ? _devDeps : getPackageJson(pathOveride) || {};
  _devDeps = devDeps;
  return _devDeps && Object.keys(devDeps || {}).includes(dep);
}

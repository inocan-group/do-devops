import { IPackageJson } from "common-types";
import { getPackageJson } from "./index";

let _deps: IPackageJson["dependencies"];

export function hasDependency(dep: string, pathOveride?: string) {
  const deps = _deps ? _deps : (getPackageJson(pathOveride) || ({} as IPackageJson)).dependencies;
  _deps = deps;
  return _deps && Object.keys(deps).includes(dep);
}

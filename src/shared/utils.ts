import { IPackageJson } from "common-types";
import { readFileSync } from "fs";
import path from "path";

export function getPackageJson(pathOveride?: string) {
  const rootPath = pathOveride || process.env.PWD;
  const packageJson: IPackageJson = JSON.parse(
    readFileSync(path.join(rootPath, "/package.json"), {
      encoding: "utf-8"
    })
  );

  return packageJson;
}

let _devDeps: IPackageJson["devDependencies"];
export function hasDevDependency(dep: string, pathOveride?: string) {
  const devDeps = _devDeps
    ? _devDeps
    : getPackageJson(pathOveride).devDependencies;
  _devDeps = devDeps;
  return Object.keys(devDeps).includes(dep);
}

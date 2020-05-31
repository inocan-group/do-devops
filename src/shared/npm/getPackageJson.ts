import * as fs from "fs";
import * as path from "path";

import { IDictionary, IPackageJson } from "common-types";

import { getLocalPackageJson } from "./cache/packageJsonCache";

let _cache: IPackageJson;

/**
 * returns `package.json` of the local repo as a typed object
 */
export function getPackageJson(pathOverride?: string) {
  if (getLocalPackageJson()) {
    return getLocalPackageJson() as IPackageJson;
  }
  const filename = path.join(pathOverride || process.cwd(), "package.json");

  // TODO: come back and validate if this is a good idea
  if (!fs.existsSync(filename)) {
    return {} as IPackageJson;
  }

  return JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" })) as IPackageJson;
}

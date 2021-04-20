import fs from "fs";
import path from "path";
import { IPackageJson } from "common-types";
import { getLocalPackageJson } from "./cache/packageJsonCache";

/**
 * returns the `package.json` of the local repo as a typed object
 */
export function getPackageJson(pathOverride?: string): IPackageJson {
  if (getLocalPackageJson()) {
    const p = getLocalPackageJson();
    return p as IPackageJson;
  }
  const filename = path.join(pathOverride || process.cwd(), "package.json");

  if (!fs.existsSync(filename)) {
    throw new Error(`The package.json file at "${filename}" does not exist!`);
  }

  return JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" })) as IPackageJson;
}

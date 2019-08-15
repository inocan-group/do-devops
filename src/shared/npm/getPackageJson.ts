import fs from "fs";
import path from "path";
import { IPackageJson } from "common-types";
/**
 * returns `package.json` of the local repo as a typed object
 */
export function getPackageJson(pathOverride?: string) {
  const filename = path.join(pathOverride || process.cwd(), "package.json");
  return JSON.parse(
    fs.readFileSync(filename, { encoding: "utf-8" })
  ) as IPackageJson;
}

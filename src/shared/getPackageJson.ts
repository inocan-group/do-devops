import fs from "fs";
import path from "path";
import { IPackageJson } from "common-types";
/**
 * returns `package.json` of the local repo as a typed object
 */
export function getPackageJson() {
  const filename = path.join(process.cwd(), "package.json");
  const hasServerlessConfig = fs.existsSync(filename);
  if (hasServerlessConfig) {
    const file = JSON.parse(
      fs.readFileSync(filename, { encoding: "utf-8" })
    ) as IPackageJson;

    return file;
  } else {
    return false;
  }
}

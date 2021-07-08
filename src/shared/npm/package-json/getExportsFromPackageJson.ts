import { IPackageJson } from "common-types";
import { retain } from "native-dash";

/**
 * Given a `package.json` passed in, if entries for `main`, `module` or `types` 
 * is found they will be returned. Otherwise 
 */
export function getExportsFromPackageJson(pkg: IPackageJson) {
  if (pkg.main || pkg.module || pkg.types) {
    return retain(pkg, "main", "module", "types");
  }

  return false;
}
import path from "path";
import { getPackageJson } from "./getPackageJson";

/**
 * Tests whether the package.json has a `main` entry point / export which
 * typically suggest a CommonJS code export.
 *
 * > Optionally, you can state the name of a _dependency_ and it will
 * check for a script in the package.json of the dependency.
 */
export function hasTypingsExport(dep?: string) {
  if (dep) {
    dep = path.join(
      process.cwd(),
      "node_modules/",
      `${dep.replace(/\/{0,1}node_modules\/{0,1}/, "")}`
    );
  }
  const pkg = dep ? getPackageJson(dep) : getPackageJson();
  return pkg.typings || pkg.types ? true : false;
}

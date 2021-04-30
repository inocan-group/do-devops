import { getPackageJson } from "~/shared/npm";

/**
 * Tests whether the package.json has a particular `script` name.
 *
 * Optionally, you can state the name of a _dependency_ and it will
 * check for a script in the package.json of the dependency.
 */
export function hasScript(script: string, dep?: string) {
  if (dep) {
    dep = `node_modules/${dep.replace(/\/{0,1}node_modules\/{0,1}/, "")}`;
  }
  const pkg = dep ? getPackageJson(dep) : getPackageJson();
  return Object.keys(pkg.scripts || {}).includes(script);
}

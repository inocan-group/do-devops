import { getPackageJson } from "src/shared/npm";

/**
 * Checks whether the given repo has a package as a "dependency".
 */
export function hasDependency(dep: string, pathOveride?: string) {
  try {
    const pkg = getPackageJson(pathOveride);
    const deps = pkg.dependencies;
    return deps && deps[dep];
  } catch {
    return false;
  }
}

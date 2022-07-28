import { getPackageJson } from "src/shared/npm";

export function hasDependency(dep: string, pathOveride?: string) {
  try {
    const pkg = getPackageJson(pathOveride);
    const deps = pkg.dependencies;
    return deps && deps[dep];
  } catch {
    return false;
  }
}

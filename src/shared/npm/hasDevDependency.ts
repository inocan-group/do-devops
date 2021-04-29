import { getPackageJson } from "./index";

export function hasDevDependency(dep: string, pathOveride?: string) {
  try {
    const pkg = getPackageJson(pathOveride);
    const devDeps = pkg.devDependencies;
    return devDeps && devDeps[dep];
  } catch {
    return false;
  }
}

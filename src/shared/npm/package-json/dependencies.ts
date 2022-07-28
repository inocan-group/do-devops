import { INpmDependencies } from "src/@types";
import { convertDepDictionaryToArray } from "./convertDepDictionaryToArray";
import { getPackageJson } from "./getPackageJson";

/**
 * Returns a hash with a _key_ representing each dependency type (aka, dependencies, devDependencies, etc.).
 * If there are dependencies in that group it will be converted into an array of dependencies but in cases
 * where that group is not represented it's value will be `false`.
 */
export function dependencies(dir?: string): INpmDependencies {
  const pkg = getPackageJson(dir);
  const dependencies = pkg.dependencies ? convertDepDictionaryToArray(pkg.dependencies) : [];
  const devDependencies = pkg.devDependencies
    ? convertDepDictionaryToArray(pkg.devDependencies)
    : [];
  const peerDependencies = pkg.peerDependencies
    ? convertDepDictionaryToArray(pkg.peerDependencies)
    : [];
  const optionalDependencies = pkg.optionalDependencies
    ? convertDepDictionaryToArray(pkg.optionalDependencies)
    : [];
  const total =
    dependencies.length +
    devDependencies.length +
    peerDependencies.length +
    optionalDependencies.length;

  return {
    total,
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
    hasDependencies: dependencies.length > 0,
    hasDevDependencies: devDependencies.length > 0,
    hasOptionalDependencies: optionalDependencies.length > 0,
    hasPeerDependencies: peerDependencies.length > 0,
  };
}

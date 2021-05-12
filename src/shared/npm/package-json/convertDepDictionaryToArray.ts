import { IDictionary } from "common-types";

/**
 * converts the default dictionary structure of dependencies in `package.json`
 * to an array of `{ name: string, version: string }`
 */
export function convertDepDictionaryToArray(deps: IDictionary<string>) {
  return Object.keys(deps).map((dep) => ({ name: dep, version: deps[dep] }));
}

import { IDictionary } from "common-types";

/**
 * **getFunctionNames**
 *
 * Given a set of paths to function definition files, will return a
 * lookup hash which provides the "function name" as the output
 */
export function getFunctionNames(paths: string[]) {
  return paths.reduce((acc, current) => {
    const filename = (current.split("/").pop() || "").replace(".defn.ts", "");

    acc[current] = filename;
    return acc;
  }, {} as IDictionary<string>);
}

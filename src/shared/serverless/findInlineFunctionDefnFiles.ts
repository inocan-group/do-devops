import path from "path";
import fg from "fast-glob";

/**
 * **findInlineFunctionDefnFiles**
 *
 * Returns an array of `*.defn.ts` files
 *
 * @param basePath you can optionally express where to start looking for config files
 * instead of the default of `${PWD}/src`
 */
export function findInlineFunctionDefnFiles(basePath?: string) {
  const glob = basePath
    ? path.join(basePath, "/**/*.defn.ts")
    : path.join(process.env.PWD, "/src/**/*.defn.ts");

  return fg.sync([glob]) as string[];
}

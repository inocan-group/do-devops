import path from "path";
import { IDictionary } from "common-types";

/**
 * **getNamespacedFilename**
 *
 * Directories off of the "root/base" should be considered a "namespace" so that
 * function names do not collide as well as to ensure that a functions "context"
 * if fully captured by the name. For this reason a handler function named
 * `netlify/deployWebhook.ts` will be resolved to `service-name-[stage]-netlifyDeployWebhook`.
 *
 * This function is reponsible for providing a lookup hash who's keys are
 * the passed in
 */
export function getNamespacedLookup(fns: string[], basePath?: string) {
  const root = basePath
    ? path.resolve(basePath)
    : path.join(process.env.PWD || "", "/src");
  return fns.reduce((acc, fn) => {
    const parts = fn
      .replace(root, "")
      .split("/")
      .filter((i) => i);
    parts[parts.length - 1] = parts[parts.length - 1].replace(".defn.ts", "");
    acc[fn] = parts
      .map((p, i) => (i === 0 ? p : p.slice(0, 1).toUpperCase() + p.slice(1)))
      .join("");
    return acc;
  }, {} as IDictionary);
}

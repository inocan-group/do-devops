import { spawnSync } from "child_process";
import { DoDevopObservation } from "~/@types";

/**
 * points `eslint` toward a file with the `--fix` flag turned on.
 *
 * Note: this will only run if the `eslint` observation is in place.
 */
export function lintfix(file: string, observations: Set<DoDevopObservation>) {
  if (observations.has("eslint")) {
    spawnSync("npx", ["eslint", file, "--fix"], {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  }

  return false;
}

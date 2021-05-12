import { exec } from "shelljs";
import { DoDevopObservation } from "~/@types";

/**
 * points `eslint` toward a file with the `--fix` flag turned on.
 *
 * Note: this will only run if the `eslint` observation is in place.
 */
export function lintfix(file: string, observations: Set<DoDevopObservation>) {
  if (observations.has("eslint")) {
    const result = exec(`eslint ${file} --fix`, { silent: true });
    return result.code === 0 ? true : false;
  }

  return false;
}

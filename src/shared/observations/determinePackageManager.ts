import { PackageManagerObservation, DoDevopObservation } from "~/@types/observations";
import { DevopsError } from "~/errors";
import { listQuestionNow } from "../interactive";

/**
 * Based on all observations made at startup, this function will try to
 * determine which package manager is being used in the current repo.
 *
 * If it can not be determined, you may optionally switch to interactive mode
 * to get this information but otherwise it will return false.
 *
 * Note: if there's no `package.json` in current directory it will throw an error.
 */
export async function determinePackageManager(
  observations: Set<DoDevopObservation>,
  interactive: boolean = false
): Promise<false | PackageManagerObservation> {
  if (!observations.has("packageJson")) {
    throw new DevopsError(
      `Can not determine the default package manager in a directory that has no package.json file!`,
      "not-ready/missing-package-json"
    );
  }

  if (observations.has("yarn")) {
    return "yarn";
  }
  if (observations.has("npm")) {
    return "npm";
  }
  if (observations.has("pnpm")) {
    return "pnpm";
  }

  if (interactive) {
    const answer = await listQuestionNow(
      "We couldn't determine your default package manager, please choose from the list.",
      ["npm", "pnpm", "yarn", "none"],
      "npm"
    );

    return answer === "none" ? false : answer;
  }

  return false;
}

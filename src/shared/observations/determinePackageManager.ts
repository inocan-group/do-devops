import chalk from "chalk";
import { PackageManagerObservation, DoDevopObservation } from "~/@types/observations";
import { DevopsError } from "~/errors";
import { askListQuestion } from "~/shared/interactive";
import { emoji } from "~/shared/ui";
import { getProjectConfig, saveProjectConfig } from "~/shared/config";
import { removeOtherLockFiles } from "~/shared/npm";
import { Options } from "~/@types";
import { installPackageManager } from "~/shared/install";

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
  opts: Options<{
    silent: boolean;
    manager?: PackageManagerObservation;
    interactive: boolean;
  }>,
  observations: Set<DoDevopObservation>
): Promise<false | PackageManagerObservation> {
  if (!observations.has("packageJson")) {
    throw new DevopsError(
      `Can not determine the default package manager in a directory that has no package.json file!`,
      "not-ready/missing-package-json"
    );
  }

  if (observations.has("packageManagerConflict")) {
    console.log(
      `- ${emoji.warn}} there are indications of {italic more} than one package manager being used!`
    );
    const pkgManager = await askListQuestion<
      Exclude<PackageManagerObservation, "packageManagerConflict">
    >("Which package manager do you expect to use in this repo?", ["npm", "pnpm", "yarn"], {
      default: observations.has("pnpm") ? "pnpm" : observations.has("yarn") ? "yarn" : "npm",
    });
    await saveProjectConfig({ general: { pkgManager } });
    const removed = await removeOtherLockFiles(pkgManager);
    if (removed.length > 0) {
      console.log(chalk`- removed `);
    }
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

  const config = getProjectConfig();
  if (config.general?.pkgManager) {
    return config.general.pkgManager;
  }

  if (opts.interactive) {
    const manager = await askListQuestion<PackageManagerObservation>(
      "We couldn't determine your default package manager, please choose from the list.",
      ["npm", "pnpm", "yarn"],
      { default: "npm" }
    );
    await installPackageManager({ ...opts, manager }, observations);
    return manager;
  }

  return false;
}

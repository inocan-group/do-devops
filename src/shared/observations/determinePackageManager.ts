
import { PackageManagerObservation, DoDevopObservation } from "src/@types/observations";
import { DevopsError } from "src/errors";
import { askListQuestion } from "src/shared/interactive";
import { emoji } from "src/shared/ui";
import {
  getProjectConfig,
  getUserConfig,
  saveProjectConfig,
  saveUserConfig,
} from "src/shared/config";
import { removeOtherLockFiles } from "src/shared/npm";
import { GlobalOptions } from "src/@types";
import chalk from "chalk";

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
  opts: GlobalOptions<{
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
      `- ${emoji.warn}} there are indications of ${chalk.italic`more`} than one package manager being used!`
    );
    const pkgManager = await askListQuestion(
      "Which package manager do you expect to use in this repo?",
      ["npm", "pnpm", "yarn"] as const,
      {
        default: observations.has("pnpm") ? "pnpm" : observations.has("yarn") ? "yarn" : "npm",
      }
    );
    await saveProjectConfig({ general: { pkgManager } });
    const removed = await removeOtherLockFiles(pkgManager);
    if (removed.length > 0) {
      console.log(`- removed `);
    }
  }

  const userConfig = getUserConfig();

  if (observations.has("yarn")) {
    return "yarn";
  }
  if (observations.has("npm")) {
    return "npm";
  }
  if (observations.has("pnpm")) {
    return "pnpm";
  }

  if (userConfig.general?.pkgManager) {
    return userConfig.general?.pkgManager;
  }

  const config = getProjectConfig();
  if (config.general?.pkgManager) {
    return config.general.pkgManager;
  }

  if (opts.interactive) {
    const manager = await askListQuestion(
      "We couldn't determine the package manager to use, would you like to add a default pkg manager to your user profile?",
      ["npm", "pnpm", "yarn", "no thanks"] as const,
      { default: "pnpm" }
    );
    if (manager === "no thanks") {} else {
      await saveUserConfig({ general: { pkgManager: manager } });
      return manager;
    }
  }

  return false;
}

/* eslint-disable unicorn/no-process-exit */

import { omit } from "native-dash";
import { DoDevopObservation, Options } from "src/@types";
import { logger } from "src/shared/core";
import { determinePackageManager } from "src/shared/observations";
import { emoji } from "src/shared/ui";
import { getPackageJson, savePackageJson } from "src/shared/npm";
import { spawnSync } from "node:child_process";
import chalk from "chalk";

/**
 * Removes a dependency from the repo's package.json file.
 *
 * The dep removed can be any of the dependency types: _prod, dev, optional, or peer_.
 */
export async function removeDep(
  opts: Options,
  observations: Set<DoDevopObservation>,
  ...packages: string[]
) {
  const log = logger(opts);
  const pkgManager = await determinePackageManager({}, observations);
  const cmd = ["remove", ...packages];
  log.whisper(`- removing with ${chalk.blue`${pkgManager} ${cmd}`}`);
  if (!pkgManager) {
    log.shout("package manager undetermined!");
    process.exit(1);
  }
  try {
    spawnSync(pkgManager, cmd, { stdio: "inherit" });
    log.info(
      `- ${emoji.party} Packages [ ${chalk.italic.gray.dim(packages.join(
        ", "
      ))} ] ${chalk.italic`removed`}`
    );
    const pkg = getPackageJson();
    let pkgChanged = false;
    for (const p of packages) {
      if (pkg?.optionalDependencies?.[p]) {
        pkg.optionalDependencies = omit(pkg.optionalDependencies, p);
        pkgChanged = true;
      }
      if (pkg?.peerDependencies?.[p]) {
        pkg.peerDependencies = omit(pkg.peerDependencies, p);
        pkgChanged = true;
      }
    }
    if (pkgChanged) {
      await savePackageJson(pkg);
    }

    return true;
  } catch {
    log.info(
      `- ${emoji.poop} failure while trying to remove npm packages: ${packages.join(", ")}`
    );
    return false;
  }
}

import chalk from "chalk";
import { omit } from "native-dash";
import { exec } from "shelljs";
import { DoDevopObservation, IGlobalOptions } from "~/@types";
import { logger } from "~/shared/core";
import { determinePackageManager } from "~/shared/observations";
import { emoji } from "~/shared/ui";
import { getPackageJson, savePackageJson } from "~/shared/npm";

/**
 * Removes a dependency from the repo's package.json file.
 *
 * The dep removed can be any of the dependency types: _prod, dev, optional, or peer_.
 */
export async function removeDep(
  opts: IGlobalOptions,
  observations: Set<DoDevopObservation>,
  ...packages: string[]
) {
  const log = logger(opts);
  const pkgManager = await determinePackageManager({}, observations);
  const cmd = `${pkgManager} remove ${packages}`;
  log.whisper(chalk`- removing with {blue ${cmd}}`);
  const response = exec(cmd);
  if (response.code === 0) {
    log.info(
      chalk`- ${emoji.party} Packages [{italic {gray {dim ${packages.join(
        ", "
      )}}}}] {italic removed}`
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
  } else {
    log.info(
      chalk`- ${emoji.poop} failure while trying to remove npm packages: ${packages.join(", ")} [${
        response.code
      }]`
    );
    log.info(chalk`\n{gray ${response.stderr}}\n`);
  }

  return response.code === 0 ? true : false;
}

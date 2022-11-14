import chalk from "chalk";
import { execSync } from "node:child_process";
import { DoDevopObservation, Options } from "src/@types";
import { logger } from "src/shared/core";
import { determinePackageManager } from "src/shared/observations";
import { emoji } from "src/shared/ui";

export async function installDevDep(
  opts: Options,
  observations: Set<DoDevopObservation>,
  ...packages: string[]
) {
  const log = logger(opts);
  const pkgManager = await determinePackageManager({ ...opts, interactive: true }, observations);
  const cmd =
    pkgManager === "npm"
      ? `npm install --save-dev ${packages.join(" ")}`
      : `${pkgManager} add ${pkgManager === "yarn" ? "--dev" : "--save-dev"} ${packages.join(" ")}`;
  log.whisper(`- installing with {blue ${cmd}}`);
  try {
    execSync(cmd);
    log.info(
      `\n- ${emoji.checkmark} package${
        packages.length > 1 ? "s" : ""
      } [ {italic {gray ${packages.join(", ")}}} ] {italic installed} as dev dependency${
        packages.length > 1 ? "ies" : "y"
      }\n`
    );
    return true;
  } catch (error) {
    log.info(`{gray - {red failure} trying to install npm packages: ${cmd}}`);
    log.info(`\n{gray ${(error as Error).message}}\n`);
    return false;
  }
}

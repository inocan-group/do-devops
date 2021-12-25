import chalk from "chalk";
import { exec } from "shelljs";
import { DoDevopObservation, Options } from "~/@types";
import { logger } from "~/shared/core";
import { determinePackageManager } from "~/shared/observations";
import { emoji } from "~/shared/ui";

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
  log.whisper(chalk`- installing with {blue ${cmd}}`);
  const response = exec(cmd);
  if (response.code === 0) {
    log.info(
      chalk`\n- ${emoji.checkmark} package${
        packages.length > 1 ? "s" : ""
      } [ {italic {gray ${packages.join(", ")}}} ] {italic installed} as dev dependenc${
        packages.length > 1 ? "ies" : "y"
      }\n`
    );
  } else {
    log.info(chalk`{gray - {red failure} trying to install npm packages: ${cmd}}`);
    log.info(chalk`\n{gray ${response.stderr}}\n`);
  }

  return response.code === 0 ? true : false;
}

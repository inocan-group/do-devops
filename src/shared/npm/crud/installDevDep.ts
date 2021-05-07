import chalk from "chalk";
import { exec } from "shelljs";
import { DoDevopObservation, IGlobalOptions } from "~/@types";
import { logger } from "~/shared/core";
import { determinePackageManager } from "../../observations";
import { emoji } from "../../ui";

export async function installDevDep(
  opts: IGlobalOptions,
  observations: Set<DoDevopObservation>,
  ...packages: string[]
) {
  const log = logger(opts);
  const pkgManager = await determinePackageManager(opts, observations);
  const cmd =
    pkgManager === "npm"
      ? `npm install --save-dev ${packages.join(" ")}`
      : `${pkgManager} add ${packages.join(" ")}`;
  log.whisper(chalk`- installing with {blue ${cmd}}`);
  const response = exec(cmd);
  if (response.code === 0) {
    log.info(
      chalk`- ${emoji.party} Packages [{italic {gray {dim ${packages.join(
        ", "
      )}}}}] {italic installed} as a dev dependenc${packages.length > 1 ? "ies" : "y"}`
    );
  } else {
    log.whisper(
      chalk`{gray- {red failure} while trying to install npm packages: ${packages.join(", ")} [${
        response.code
      }]}`
    );
    log.whisper(chalk`\n{gray ${response.stderr}}\n`);
  }

  return response.code === 0 ? true : false;
}

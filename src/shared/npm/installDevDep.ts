import chalk from "chalk";
import { exec } from "shelljs";
import { DoDevopObservation } from "~/@types";
import { determinePackageManager } from "../observations";
import { emoji } from "../ui";

export async function installDevDep(observations: Set<DoDevopObservation>, ...packages: string[]) {
  const pkgManager = await determinePackageManager(observations);
  const cmd = pkgManager === "yarn" ? `yarn add --dev ${packages}` : `${pkgManager}`;
  console.log(chalk`- installing with {blue ${cmd}}`);
  const response = exec(cmd);
  if (response.code === 0) {
    console.log(
      chalk`- ${emoji.party} Packages [{italic {gray {dim ${packages.join(
        ", "
      )}}}}] {italic installed} as a dev dependenc${packages.length > 1 ? "ies" : "y"}`
    );
  } else {
    console.log(
      chalk`- ${emoji.poop} failure while trying to install npm packages: ${packages.join(", ")} [${
        response.code
      }]`
    );
    console.log(chalk`\n{gray ${response.stderr}}\n`);
  }

  return response.code === 0 ? true : false;
}

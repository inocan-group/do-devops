import { asyncExec } from "async-shelljs";
import chalk from "chalk";
import { DoDevopObservation, PackageManagerObservation } from "~/@types/observations";
import { saveToProjectConfig } from "..";
import { listQuestionNow } from "../interactive";
import { determinePackageManager } from "../observations";

export async function proxyToPackageManager(
  cmd: string,
  observations: DoDevopObservation[]
) {
  const pkgManager = await determinePackageManager(observations, true);
  if (pkgManager) {
    let pkgCmd: string;
    switch (cmd) {
      case "install":
        pkgCmd = pkgManager === "yarn" ? "" : `${pkgManager} install`;
        break;
      case "outdated":
      case "upgrade":
        pkgCmd = `${pkgManager} ${cmd}`;
        break;
      default:
        pkgCmd = `${pkgManager === "yarn" ? "yarn" : `${pkgManager} run`}`;
    }

    console.log(
      chalk`{gray - the primary utility of the {italic build} command is when paired with a Serverless project}`
    );
    console.log(
      chalk`{gray - since this project is not we will instead just proxy {blue ${pkgCmd}} for you}\n`
    );
    await asyncExec(pkgCmd);
  } else {
    if (!observations.includes("packageJson")) {
      console.log(
        chalk`- the "" command is only applicable to being run in the root of NodeJS which has a {blue package.json} file in it.\n`
      );
    } else {
      console.log(
        `- The "${cmd}" command will be used in Serverless projects but otherwise proxies the command to your package manager of choice. `
      );
      console.log(
        chalk`- we can not currently tell {italic which} package manager you're using.`
      );
      const answer:
        | PackageManagerObservation
        | "not now, thanks" = await listQuestionNow(
        "Would you like save the package manager to this repo in a config file?",
        ["not now, thanks", "npm", "pnpm", "yarn"]
      );
      if (answer !== "not now, thanks") {
        saveToProjectConfig("general", { pkgManager: answer });
      }
    }
  }
}

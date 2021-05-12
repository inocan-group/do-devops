import { exec } from "async-shelljs";
import chalk from "chalk";
import { DoDevopObservation, PackageManagerObservation } from "~/@types/observations";
import { saveProjectConfig } from "~/shared/config";
import { askListQuestion } from "~/shared/interactive";
import { determinePackageManager } from "~/shared/observations";
import { hasScript } from "../npm";
import { emoji } from "../ui";

const NON_PROXY = new Set(["install", "outdated", "update", "why", "ls"]);

function isDevFlag(flag: string, mngr: PackageManagerObservation) {
  const matched = ["--save-dev", "--dev"].includes(flag);
  if (!matched) {
    return undefined;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-dev";
    case "yarn":
    default:
      return "--dev";
  }
}
function isPeerFlag(flag: string, mngr: PackageManagerObservation) {
  const matched = ["--save-peer", "--peer"].includes(flag);
  if (!matched) {
    return undefined;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-peer";
    case "yarn":
    default:
      return "--peer";
  }
}
function isOptionalFlag(flag: string, mngr: PackageManagerObservation) {
  const matched = ["--save-optional", "--optional"].includes(flag);
  if (!matched) {
    return undefined;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-optional";
    case "yarn":
    default:
      return "--optional";
  }
}

export async function proxyToPackageManager(
  cmd: string,
  observations: Set<DoDevopObservation>,
  argv?: string[]
) {
  // can't continue without package.json
  if (!observations.has("packageJson")) {
    console.log(
      chalk`- ${emoji.shocked} the {green ${cmd}} command is only meant to used in the root of NodeJS which has a {blue package.json} file in it.\n`
    );
    process.exit();
  }

  const pkgManager = await determinePackageManager({ interactive: true }, observations);
  if (pkgManager) {
    let pkgCmd: string;
    let isScriptCmd = false;

    switch (cmd) {
      case "install":
        const args = argv?.map(
          (a) =>
            isPeerFlag(a, pkgManager) ||
            isOptionalFlag(a, pkgManager) ||
            isDevFlag(a, pkgManager) ||
            a
        );
        pkgCmd =
          pkgManager === "yarn"
            ? args && args.length > 0
              ? `yarn add ${args.join(" ")}`
              : "yarn"
            : `${pkgManager} install${args ? " " + args.join(" ") : ""}`;
        break;
      case "outdated":
      case "upgrade":
      case "why":
        pkgCmd = `${pkgManager} ${cmd}${argv ? " " + argv.join(" ") : ""}`;
        break;
      case "ls":
        pkgCmd =
          pkgManager === "yarn"
            ? `yarn list --pattern "${argv?.pop()}"`
            : `${pkgManager} ls ${argv?.pop()}`;
        break;
      default:
        isScriptCmd = true;
        pkgCmd = `${
          pkgManager === "yarn"
            ? `yarn ${cmd}${argv ? " " + argv.join(" ") : ""}`
            : `${pkgManager} run ${cmd}${argv ? " " + argv.join(" ") : ""}`
        }`;
    }

    if (NON_PROXY.has(cmd)) {
      console.log(
        chalk`{gray - we detected use of the {blue ${pkgManager}} in this repo and will {italic proxy} "${cmd}" to: {blue ${pkgCmd}}}\n`
      );
    } else {
      if (isScriptCmd && !hasScript(cmd)) {
        console.log(
          chalk`{gray - we {italic would} proxy this as {blue ${pkgCmd}} but you don't have "${cmd}" defined in your scripts section.}\n`
        );
        process.exit();
      }

      console.log(
        chalk`{gray - since this project is not we will instead just proxy {blue ${pkgCmd}} for you}\n`
      );
    }

    exec(pkgCmd, {
      env: { ...process.env, TERM: "xterm-256color", FORCE_COLOR: "true" },
      timeout: 0,
    });
  } else {
    // if (!NON_PROXY.has(cmd)) {
    //   console.log(
    //     `- The "${cmd}" command will be used in Serverless projects but otherwise proxies the command to your package manager of choice. `
    //   );
    // }
    console.log(chalk`- we can not currently tell {italic which} package manager you're using.`);
    const answer:
      | PackageManagerObservation
      | "not now, thanks" = await askListQuestion(
      "Would you like save the package manager to this repo in a config file?",
      ["not now, thanks", "npm", "pnpm", "yarn"]
    );
    if (answer !== "not now, thanks") {
      saveProjectConfig({ general: { pkgManager: answer } });
    }
  }
}

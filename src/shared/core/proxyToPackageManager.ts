// import { exec } from "async-shelljs";
import chalk from "chalk";
import { spawnSync } from "child_process";
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
    return;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-dev";
    case "yarn":
      return "--dev";
    case "cargo":
      return "";
    default:
      throw new Error(`unknown package manager: ${mngr}`);
  }
}

function isPeerFlag(flag: string, mngr: PackageManagerObservation) {
  const matched = ["--save-peer", "--peer"].includes(flag);
  if (!matched) {
    return;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-peer";
    case "yarn":
      return "--peer";
    default:
      throw new Error(`unknown package manager: ${mngr}`);
  }
}
function isOptionalFlag(flag: string, mngr: PackageManagerObservation) {
  const matched = ["--save-optional", "--optional"].includes(flag);
  if (!matched) {
    return;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-optional";
    case "yarn":
      return "--optional";
    default:
      throw new Error(`unknown package manager: ${mngr}`);
  }
}

export async function proxyToPackageManager(
  cmd: string,
  observations: Set<DoDevopObservation>,
  argv?: string[]
) {
  // can't continue without package.json
  if (!observations.has("packageJson")) {
    console.error(
      chalk`- ${emoji.shocked} the {green ${cmd}} command is only meant to used in the root of NodeJS which has a {blue package.json} file in it.\n`
    );
    process.exit();
  }

  const pkgManager = await determinePackageManager({ interactive: true }, observations);
  if (pkgManager) {
    let pkgCmd: string;
    let isScriptCmd = false;
    const args = argv?.map(
      (a) =>
        isPeerFlag(a, pkgManager) || isOptionalFlag(a, pkgManager) || isDevFlag(a, pkgManager) || a
    );

    switch (cmd) {
      case "link":
      case "unlink":
        pkgCmd = `${pkgManager} ${cmd} ${args?.join(" ")}`;
        break;

      case "install":
        pkgCmd =
          pkgManager === "yarn"
            ? args && args.length > 0
              ? `yarn add ${args.join(" ")}`
              : "yarn"
            : pkgManager === "pnpm" && (!args || args?.length === 0)
            ? `${pkgManager} install${args ? " " + args.join(" ") : ""}`
            : `${pkgManager} add${" " + args?.join(" ")}`;
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
            : `${pkgManager} run ${cmd}${argv ? " " + argv.join(" ") : ""} --silent`
        }`;
    }

    if (NON_PROXY.has(cmd)) {
      console.error(
        chalk`{gray - we detected use of the {blue ${pkgManager}} in this repo and will {italic proxy} "${cmd}" to: {blue ${pkgCmd}}}\n`
      );
    } else {
      if (isScriptCmd && !hasScript(cmd)) {
        console.log(
          chalk`{gray - we {italic would} proxy this as {blue ${pkgCmd}} but you don't have "${cmd}" defined in your scripts section.}\n`
        );
        process.exit();
      }

      console.error(chalk`{gray - we will proxy {blue ${pkgCmd}} for you}\n`);
    }

    const cmdParts = pkgCmd.split(/\s+/g).filter(Boolean);

    const thread = spawnSync(cmdParts[0], [...cmdParts.slice(1)], {
      env: { ...process.env, FORCE_COLOR: "true", TERM: "xterm-256color" },
      timeout: 0,
      stdio: "inherit",
    });

    if (thread.error) {
      throw new Error(`- ${emoji.poop} ran into problems running ${cmdParts.join(" ")}`);
    }
  } else {
    console.log(chalk`- we can not currently tell {italic which} package manager you're using.`);
    const answer: PackageManagerObservation | "not now, thanks" = await askListQuestion(
      "Would you like save the package manager to this repo in a config file?",
      ["not now, thanks", "npm", "pnpm", "yarn"]
    );
    if (answer !== "not now, thanks") {
      saveProjectConfig({ general: { pkgManager: answer } });
    }
  }
}

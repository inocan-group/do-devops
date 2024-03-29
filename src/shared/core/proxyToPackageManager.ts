/* eslint-disable unicorn/no-process-exit */
// import { exec } from "async-shelljs";
import chalk from "chalk";
import { spawnSync } from "node:child_process";
import { DoDevopObservation, PackageManagerObservation } from "src/@types/observations";
import { saveProjectConfig } from "src/shared/config";
import { askListQuestion } from "src/shared/interactive";
import { determinePackageManager } from "src/shared/observations";
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
    case "pnpm": {
      return "--save-dev";
    }
    case "yarn": {
      return "--dev";
    }
    case "cargo": {
      return "";
    }
    default: {
      throw new Error(`unknown package manager: ${mngr}`);
    }
  }
}

function isPeerFlag(flag: string, mngr: PackageManagerObservation) {
  const matched = ["--save-peer", "--peer"].includes(flag);
  if (!matched) {
    return;
  }
  switch (mngr) {
    case "npm":
    case "pnpm": {
      return "--save-peer";
    }
    case "yarn": {
      return "--peer";
    }
    default: {
      throw new Error(`unknown package manager: ${mngr}`);
    }
  }
}
function isOptionalFlag(flag: string, mngr: PackageManagerObservation) {
  const matched = ["--save-optional", "--optional"].includes(flag);
  if (!matched) {
    return;
  }
  switch (mngr) {
    case "npm":
    case "pnpm": {
      return "--save-optional";
    }
    case "yarn": {
      return "--optional";
    }
    default: {
      throw new Error(`unknown package manager: ${mngr}`);
    }
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
      `- ${emoji.shocked} the ${chalk.green(cmd)} command is only meant to used in the root of NodeJS which has a ${chalk.blue`package.json`} file in it.\n`
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
      case "unlink": {
        pkgCmd = `${pkgManager} ${cmd} ${args?.join(" ")}`;
        break;
      }

      case "install": {
        pkgCmd =
          pkgManager === "yarn"
            ? args && args.length > 0
              ? `yarn add ${args.join(" ")}`
              : "yarn"
            : pkgManager === "pnpm" && (!args || args?.length === 0)
            ? `${pkgManager} install${args ? " " + args.join(" ") : ""}`
            : `${pkgManager} add${" " + args?.join(" ")}`;
        break;
      }
      case "outdated":
      case "upgrade":
      case "why": {
        pkgCmd = `${pkgManager} ${cmd}${argv ? " " + argv.join(" ") : ""}`;
        break;
      }
      case "ls": {
        pkgCmd =
          pkgManager === "yarn"
            ? `yarn list --pattern "${argv?.pop()}"`
            : `${pkgManager} ls ${argv?.pop()}`;
        break;
      }
      default: {
        isScriptCmd = true;
        pkgCmd = `${
          pkgManager === "yarn"
            ? `yarn ${cmd}${argv ? " " + argv.join(" ") : ""}`
            : `${pkgManager} run ${cmd}${argv ? " " + argv.join(" ") : ""}`
        }`;
      }
    }

    if (NON_PROXY.has(cmd)) {
      console.error(
        `- we detected use of ${chalk.blue(pkgManager)} in this repo and will ${chalk.italic`proxy`} "${cmd}" to: ${chalk.blue(pkgCmd)}\n`
      );
    } else {
      if (isScriptCmd && !hasScript(cmd)) {
        console.log(
          `- we ${chalk.italic`would`} proxy this as ${chalk.blue(pkgCmd)} but you don't have "${cmd}" defined in your scripts section.\n`
        );
        process.exit();
      }

      console.error(`- we will proxy ${chalk.blue(pkgCmd)} for you\n`);
    }

    const cmdParts = pkgCmd.split(/\s+/g).filter(Boolean);

    // eslint-disable-next-line unicorn/no-useless-spread
    const thread = spawnSync(cmdParts[0], [...cmdParts.slice(1)], {
      env: { ...process.env, FORCE_COLOR: "true", TERM: "xterm-256color" },
      timeout: 0,
      stdio: "inherit",
    });

    if (thread.error) {
      throw new Error(`- ${emoji.poop} ran into problems running ${cmdParts.join(" ")}`);
    }
  } else {
    console.log(`- we can not currently tell ${chalk.italic`which`} package manager you're using.`);
    const answer = await askListQuestion(
      "Would you like save the package manager to this repo in a config file?",
      ["not now, thanks", "npm", "pnpm", "yarn"] as const
    );
    if (answer !== "not now, thanks") {
      saveProjectConfig({ general: { pkgManager: answer } });
    }
  }
}

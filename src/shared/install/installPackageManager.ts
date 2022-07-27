import chalk from "chalk";
import { Options, Observations, PackageManagerObservation } from "~/@types";
import { DevopsError } from "~/errors";
import { logger, proxyToPackageManager } from "~/shared/core";
import { askListQuestion } from "~/shared/interactive";
import { saveProjectConfig } from "~/shared/config";

export async function installPackageManager(
  opts: Options<{ silent: boolean; manager?: PackageManagerObservation }>,
  observations: Observations
) {
  const log = logger(opts);
  let manager = opts.manager;
  if (opts.silent && !opts.manager) {
    throw new DevopsError(
      `Can not install a package manager silently when no manager is passed in as option`,
      "install/not-ready"
    );
  }

  if (!manager) {
    manager = await askListQuestion(
      "Which package manager would you like to use for this repo?",
      ["npm", "pnpm", "yarn"] as const,
      { default: "npm" }
    );
  }

  await saveProjectConfig({ general: { pkgManager: manager } });
  log.whisper(
    chalk`{gray - ${manager} package manager saved to this repos {blue .do-devops.json} config file}`
  );
  await proxyToPackageManager("install", observations);
}

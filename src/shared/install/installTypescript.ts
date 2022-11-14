import chalk from "chalk";
import { Options, Observations } from "src/@types";
import { installDevDep } from "src/shared/npm";
import { askConfirmQuestion } from "src/shared/interactive";
import { logger } from "src/shared/core";
import { emoji } from "src/shared/ui";
import { templateDirCopy } from "src/shared/file";

/**
 * Installs and configures both **eslint** and **prettier**
 */
export async function installTypescript(
  opts: Options<{ silent: boolean }>,
  observations: Observations
) {
  const log = logger(opts);

  const proceed = opts.silent
    ? opts.silent
    : await askConfirmQuestion(`Would you like to install and configure {blue typescript}?`);

  if (!proceed) {
    return false;
  }

  const success = await installDevDep(
    opts,
    observations,
    "typescript",
    "esno",
    "ts-node",
    "@types/node@14"
  );
  if (!success) {
    log.shout(`- ${emoji.poop} there was a problem installing the Typescript dev dependencies`);
    return false;
  }
  log.whisper(`{gray - all {italic typescript} dependencies have been installed}`);

  await templateDirCopy("typescript", "/");

  log.whisper(`{gray - tsconfig file saved to root}`);

  log.info(`- ${emoji.party} {blue typescript} has been installed and configured\n`);

  return true;
}

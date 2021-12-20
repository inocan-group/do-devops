import chalk from "chalk";
import { IGlobalOptions, Observations } from "~/@types";
import { installDevDep } from "~/shared/npm";
import { askConfirmQuestion } from "~/shared/interactive";
import { logger } from "~/shared/core";
import { emoji } from "~/shared/ui";
import { templateDirCopy } from "~/shared/file";

/**
 * Installs and configures both **eslint** and **prettier**
 */
export async function installTypescript(
  opts: IGlobalOptions<{ silent: boolean }>,
  observations: Observations
) {
  const log = logger(opts);

  const proceed = opts.silent
    ? opts.silent
    : await askConfirmQuestion(chalk`Would you like to install and configure {blue typescript}?`);

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
  log.whisper(chalk`{gray - all {italic typescript} dependencies have been installed}`);

  await templateDirCopy("typescript", "/");

  log.whisper(chalk`{gray - tsconfig file saved to root}`);

  log.info(chalk`- ${emoji.party} {blue typescript} has been installed and configured\n`);

  return true;
}

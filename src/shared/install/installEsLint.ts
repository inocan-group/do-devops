import chalk from "chalk";
import { IGlobalOptions, Observations } from "~/@types";
import { installDevDep } from "~/shared/npm";
import { askConfirmQuestion } from "~/shared/interactive";
import { logger } from "~/shared/core";
import { emoji } from "~/shared/ui";
import { templateFileCopy } from "../exports";

/**
 * Installs and configures both **eslint** and **prettier**
 */
export async function installEsLint(
  opts: IGlobalOptions<{ silent: boolean }>,
  observations: Observations
) {
  const log = logger(opts);

  const proceed = opts.silent
    ? opts.silent
    : await askConfirmQuestion(chalk`Would you like to install and configure {blue eslint}?`);

  if (!proceed) {
    return false;
  }

  const success = await installDevDep(
    observations,
    "eslint",
    "prettier",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint-config-prettier",
    "eslint-plugin-import",
    "eslint-plugin-prettier",
    "eslint-plugin-promise",
    "eslint-plugin-unicorn"
  );
  if (!success) {
    log.shout(`- ${emoji.poop} there was a problem installing the eslint dev dependencies`);
    return false;
  }
  log.whisper(
    chalk`{gray - all {italic eslint} and {italic prettier} dependencies have been installed}`
  );

  await templateFileCopy("eslint/.eslintrc", "/.eslintrc");
  await templateFileCopy("eslint/.prettierrc.js", "/.prettierrc.js");

  log.whisper(
    chalk`{gray - configuration files for both {italic eslint} and {italic prettier} have been saved}`
  );

  log.info(chalk`- ${emoji.party} {blue eslint} has been installed and configured`);

  return true;
}

import { GlobalOptions, Observations } from "src/@types";
import { installDevDep } from "src/shared/npm";
import { askConfirmQuestion } from "src/shared/interactive";
import { logger } from "src/shared/core";
import { emoji } from "src/shared/ui";
import { templateFileCopy } from "src/shared/file";
import chalk from "chalk";

/**
 * Installs and configures both **eslint** and **prettier**
 */
export async function installEsLint(
  opts: GlobalOptions<{ silent: boolean }>,
  observations: Observations
) {
  const log = logger(opts);

  const proceed = opts.silent ?? (await askConfirmQuestion(`Would you like to install and configure ${chalk.blue`eslint`}?`));

  if (!proceed) {
    return false;
  }

  const success = await installDevDep(
    opts,
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
    chalk.gray` - all ${chalk.italic`eslint`} and ${chalk.italic`prettier`} dependencies have been installed`
  );

  await templateFileCopy("eslint/.eslintrc", "/.eslintrc");
  await templateFileCopy("eslint/.prettierrc.js", "/.prettierrc.js");

  log.whisper(
    chalk.gray` - configuration files for both ${chalk.italic`eslint`} and ${chalk.italic`prettier`} have been saved`
  );

  log.info(`- ${emoji.party} ${chalk.blue`eslint`} has been installed and configured\n`);

  return true;
}

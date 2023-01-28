import chalk from "chalk";
import { GlobalOptions } from "src/@types";
import { logger } from "src/shared/core";
import { templateFileCopy } from "src/shared/file";
import { askConfirmQuestion } from "src/shared/interactive";

/**
 * Installs a .gitignore file to current directory; if you want it to be confirmationless
 * then use the `silent` option.
 */
export async function installGitIgnore(opts: GlobalOptions<{ silent: boolean }>) {
  const log = logger(opts);
  if (!opts.silent) {
    const confirm = await askConfirmQuestion("Would you like us to add the file for you?");
    if (!confirm) {
      return;
    }
  }
  const copied = await templateFileCopy("git/.gitignore", ".gitignore");
  if (copied) {
    log.info(chalk.gray` - created a ${chalk.blue(".gitignore")} file in the root directory`);
  }
}

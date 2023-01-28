import { Options } from "src/@types";
import { logger } from "src/shared/core";
import { askConfirmQuestion, askInputQuestion } from "src/shared/interactive";
import { git } from "src/shared/git";
import { installGitIgnore } from "src/shared/install";
import chalk from "chalk";

export async function installGit(opts: Options<{ silent: boolean }>) {
  const log = logger(opts);
  let setupRemote = false;
  let remoteName = "origin";
  let remoteUrl = "";

  if (!opts.silent) {
    const confirm = await askConfirmQuestion(`Should we initialize ${chalk.blue`git`} for you?`);
    setupRemote = await askConfirmQuestion(
      `Would you like to set a {italic remote} for this repo now?`
    );
    if (setupRemote) {
      remoteName = await askInputQuestion("What should the remote's name be?", {
        default: remoteName,
      });
      remoteUrl = await askInputQuestion("What is the URL for remote?");
    }
    if (!confirm) {
      return;
    }
  }

  const g = git();

  await g.init();
  log.info(chalk.gray` - initialized ${chalk.blue`git`}`);
  if (setupRemote) {
    await g.addRemote(remoteName, remoteUrl);
    log.info(chalk.gray` - ${chalk.blue(remoteName)} remote setup`);
  }
  await installGitIgnore({ ...opts, silent: true });
}

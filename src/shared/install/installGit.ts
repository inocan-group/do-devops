import chalk from "chalk";
import { IGlobalOptions } from "~/@types";
import { logger } from "~/shared/core";
import { askConfirmQuestion, askInputQuestion } from "~/shared/interactive";
import { git } from "~/shared/git";
import { installGitIgnore } from "~/shared/install";

export async function installGit(opts: IGlobalOptions<{ silent: boolean }>) {
  const log = logger(opts);
  let setupRemote = false;
  let remoteName = "origin";
  let remoteUrl = "";

  if (!opts.silent) {
    const confirm = await askConfirmQuestion(chalk`Should we initialize {blue git} for you?`);
    setupRemote = await askConfirmQuestion(
      chalk`Would you like to set a {italic remote} for this repo now?`
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
  log.info(chalk`{gray - initialized {blue git}}`);
  if (setupRemote) {
    await g.addRemote(remoteName, remoteUrl);
    log.info(chalk`{gray - {blue ${remoteName}} remote setup}`);
  }
  await installGitIgnore({ ...opts, silent: true });
}

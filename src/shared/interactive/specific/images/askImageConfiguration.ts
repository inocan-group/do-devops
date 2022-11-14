import chalk from "chalk";
import { exit } from "node:process";
import { Observations } from "src/@types/observations";
import { logger } from "src/shared/core/logger";
import { ImageApi } from "src/shared/images/useImageApi";
import { emoji } from "src/shared/ui";
import { askAddImageRule, askChangeImageRule, askImageDefaults, askRemoveImageRule } from ".";
import { askListQuestion } from "../..";

export async function askImageConfiguration(o: Observations, api: ImageApi) {
  const log = logger();
  log.info(`Welcome back, your ${chalk.bold.yellow`image`} configuration summary is:\n`);
  log.info(chalk.bold.yellow`Rules:`);
  // const api: ImageApi = useImageApi(config.rules);
  if (!o.has("image-cache")) {
    log.info(`- ${emoji.eyeballs} there is no image cache yet so no summary info is available.`);
  } else {
    await api.summarize();
    log.info();
  }

  const action = await askListQuestion(`What configuration operation are you interested in?`, [
    "Add Rule",
    "Remove Rule",
    "Change Rule",
    "Manage Defaults",
    "Quit",
  ] as const);

  const actionMap = {
    "Add Rule": askAddImageRule,
    "Remove Rule": askRemoveImageRule,
    "Change Rule": askChangeImageRule,
    "Manage Defaults": askImageDefaults,
    Quit: async () => {
      log.info("exiting ...");
      exit(0);
    },
  };

  await actionMap[action](o, api);
}

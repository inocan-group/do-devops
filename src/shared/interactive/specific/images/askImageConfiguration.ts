import chalk from "chalk";
import { Keys } from "inferred-types";
import { IProjectConfig } from "~/@types";
import { Observations } from "~/@types/observations";
import { getProjectConfig } from "~/shared/config/getProjectConfig";
import { logger } from "~/shared/core/logger";
import { ImageApi, useImageApi } from "~/shared/images/useImageApi";
import { askAddImageRule, askChangeImageRule, askImageDefaults, askRemoveImageRule } from ".";
import { askListQuestion } from "../..";

export async function askImageConfiguration(o: Observations) {
  const log = logger();
  const config = getProjectConfig().image as Exclude<IProjectConfig["image"], undefined>;
  log.info(chalk`Welcome back, your {bold {yellow image}} configuration summary is:\n`);
  log.info(chalk`{bold {yellow Rules:}}`);
  const api: ImageApi = useImageApi(config.rules);
  await api.summarize();
  log.info();

  const actions = ["Add Rule", "Remove Rule", "Change Rule", "Manage Defaults", "Quit"] as const;
  type Actions = Keys<typeof actions>;

  const action = await askListQuestion<Actions>(
    `What configuration operation are you interested in?`,
    actions
  );

  const actionMap: Record<Actions, (o: Observations, api: ImageApi) => Promise<any>> = {
    "Add Rule": askAddImageRule,
    "Remove Rule": askRemoveImageRule,
    "Change Rule": askChangeImageRule,
    "Manage Defaults": askImageDefaults,
    Quit: async () => {
      log.info("exiting ...");
      process.exit();
    },
  };

  await actionMap[action](o, api);
}

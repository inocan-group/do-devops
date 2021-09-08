import chalk from "chalk";
import { Keys } from "inferred-types";
import { IProjectConfig } from "~/@types";
import { Observations } from "~/@types/observations";
import { getProjectConfig } from "~/shared/config/getProjectConfig";
import { logger } from "~/shared/core/logger";
import { useImageApi } from "~/shared/images/useImageApi";
import { askListQuestion } from "../..";

export async function askImageConfiguration(_o: Observations) {
  const log = logger();
  const config = getProjectConfig().image as Exclude<IProjectConfig["image"], undefined>;
  log.info(chalk`Welcome back, your {bold {yellow image}} configuration summary is:\n`);
  log.info(chalk`{bold {yellow Rules:}}`);
  const c = useImageApi(config.rules);
  await c.summarize();
  log.info();

  const actions = ["Add Rule", "Remove Rule", "Change Rule", "Manage Defaults", "Quit"] as const;
  type Actions = Keys<typeof actions>;

  const action = await askListQuestion<Actions>(
    `What configuration operation are you interested in?`,
    actions
  );

  const actionMap: Record<Actions, () => Promise<any>> = {
    "Add Rule": async () => "",
    "Remove Rule": async () => "",
    "Change Rule": async () => "",
    "Manage Defaults": async () => "",
    Quit: async () => {
      log.info("exit ...");
      process.exit();
    },
  };

  actionMap[action]();
}

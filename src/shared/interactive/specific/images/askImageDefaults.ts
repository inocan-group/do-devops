import chalk from "chalk";
import { IProjectConfig, Observations } from "src/@types";
import { CONFIG_FILE } from "src/shared/config/constants";
import { getProjectConfig } from "src/shared/config/getProjectConfig";
import { logger } from "src/shared/core/logger";
import { ImageApi } from "src/shared/images/useImageApi";
import { askImageConfiguration } from ".";
import { askListQuestion } from "../..";

export async function askImageDefaults(o: Observations, api: ImageApi) {
  const log = logger();
  const config = getProjectConfig().image as Exclude<IProjectConfig["image"], undefined>;
  log.info(
    `Current settings for image can be found in the -- ${chalk.blue(CONFIG_FILE)} ${chalk.italic`file`} -- and are as follows:`
  );
  const options = [
    `sourceDir: ${config.sourceDir}`,
    `destinationDir: ${config.destinationDir}`,
    `defaultWidths: ${JSON.stringify(config.defaultWidths)}`,
    `formatOptions: ${JSON.stringify(config.formatOptions)}`,
    `sidecar: ${config.sidecar}`,
  ];

  // TODO: finish editing feature
  await askListQuestion(`Which of the following do you want to edit?`, options);

  log.info();
  return askImageConfiguration(o, api);
}

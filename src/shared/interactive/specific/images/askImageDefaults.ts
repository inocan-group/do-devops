import chalk from "chalk";
import { IProjectConfig, Observations } from "~/@types";
import { CONFIG_FILE } from "~/shared/config/constants";
import { getProjectConfig } from "~/shared/config/getProjectConfig";
import { logger } from "~/shared/core/logger";
import { ImageApi } from "~/shared/images/useImageApi";
import { askImageConfiguration } from ".";
import { askListQuestion } from "../..";

export async function askImageDefaults(o: Observations, api: ImageApi) {
  const log = logger();
  const config = getProjectConfig().image as Exclude<IProjectConfig["image"], undefined>;
  log.info(
    chalk`Current settings for image can be found in the -- {blue ${CONFIG_FILE}} {italic file} -- and are as follows:`
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
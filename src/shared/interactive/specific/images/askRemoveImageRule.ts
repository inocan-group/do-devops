import { IProjectConfig, Observations } from "~/@types";
import { saveProjectConfig } from "~/shared/config";
import { getProjectConfig } from "~/shared/config/getProjectConfig";
import { logger } from "~/shared/core/logger";
import { ImageApi } from "~/shared/images/useImageApi";
import { askImageConfiguration } from ".";
import { askListQuestion } from "../../general";

export async function askRemoveImageRule(o: Observations, api: ImageApi) {
  const log = logger();
  const config = getProjectConfig().image as Exclude<IProjectConfig["image"], undefined>;

  const rule = await askListQuestion<string>(
    `Which rule do you want to remove?`,
    api.rules.map((i) => i.name)
  );

  await saveProjectConfig(
    "image.rules",
    config.rules.filter((i) => i.name !== rule)
  );

  log.info(`- ${rule} has been removed from configuration`);

  return askImageConfiguration(o);
}

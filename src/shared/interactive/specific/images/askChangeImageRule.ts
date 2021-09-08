import { IImageRule, Observations } from "~/@types";
import { logger } from "~/shared/core/logger";
import { ImageApi } from "~/shared/images/useImageApi";
import { askImageConfiguration } from ".";
import { askListQuestion } from "../..";

export async function askChangeImageRule(o: Observations, api: ImageApi) {
  const log = logger();

  let rule: string | undefined | IImageRule =
    api.rules.length === 1
      ? api.rules[0]
      : await askListQuestion<string>(
          `Which rule do you want to change?`,
          api.rules.map((i) => i.name)
        );

  if (typeof rule === "string") {
    rule = api.rules.find((i) => i.name === rule);
  }

  if (!rule) {
    log.shout("No rule was selected! Exiting");
    process.exit();
  }

  // TODO: finish editing of image rule

  return askImageConfiguration(o, api);
}

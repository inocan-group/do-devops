import chalk from "chalk";
import { DoDevopsHandler } from "~/@types";
import { getProjectConfig } from "~/shared/config";
import { logger } from "~/shared/core";
import { askConfigureImageOptimization, askImageConfiguration } from "~/shared/interactive";
import { IImageOptions } from "./options";

export const handler: DoDevopsHandler<IImageOptions> = async ({
  subCommand,
  opts,
  observations,
}) => {
  const config = getProjectConfig().image;
  const log = logger(opts);

  switch (subCommand) {
    case "config":
      // eslint-disable-next-line unicorn/prefer-ternary
      if (!config) {
        await askConfigureImageOptimization(observations);
      } else {
        await askImageConfiguration(observations);
      }
      break;

    case "optimize":
      //
      break;

    case "watch":
      //
      break;

    case "":
      if (config) {
        log.info(
          chalk`- the valid sub-commands for {blue dd image} are: {italic config, optimize,} and {italic watch}`
        );
      }
  }
};

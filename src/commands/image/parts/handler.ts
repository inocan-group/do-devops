import chalk from "chalk";
import { DoDevopsHandler } from "~/@types";
import { DevopsError } from "~/errors";
import { getProjectConfig } from "~/shared/config";
import { logger } from "~/shared/core";
import { useImageApi } from "~/shared/images";
import { askConfigureImageOptimization, askImageConfiguration } from "~/shared/interactive";
import { IImageOptions } from "./options";

export const handler: DoDevopsHandler<IImageOptions> = async ({
  subCommand,
  opts,
  observations,
}) => {
  const config = getProjectConfig().image;
  const log = logger(opts);
  const api = useImageApi(config ? config.rules : [], { clearCache: opts.force });

  switch (subCommand?.trim()) {
    case "config":
      // eslint-disable-next-line unicorn/prefer-ternary
      if (!config) {
        await askConfigureImageOptimization(observations);
      } else {
        await askImageConfiguration(observations, api);
      }
      break;

    case "optimize":
    case "convert":
      if (config && config.rules) {
        await api.convert();
      } else {
        throw new DevopsError(
          `Attempt to call optimize before any rules were configured!`,
          "image/not-ready"
        );
      }
      break;

    case "watch":
      if (config && config.rules) {
        const api = useImageApi(config.rules);
        await api.watch();
      } else {
        throw new DevopsError(
          `Attempt to call watch before any rules were configured!`,
          "image/not-ready"
        );
      }
      break;

    case "summarize":
      await api.summarize();
      break;

    case "":
      if (config) {
        log.info(
          chalk`- the valid sub-commands for {blue dd image} are: {italic config, optimize,} and {italic watch}`
        );
      }
      break;

    default:
      log.shout(
        subCommand
          ? chalk`the subcommand '${subCommand}' is not valid; valid subcommands are: {italic optimize, watch,} and {italic config}.`
          : chalk`the {bold {red image}} command expects a sub command: {blue dd image [sub-command]} where valid subcommands are {italic optimize, watch,} and {italic config}.`
      );
  }

  await api.close();
};

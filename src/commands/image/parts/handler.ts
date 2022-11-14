import { asyncExec } from "async-shelljs";
import chalk from "chalk";
import { DoDevopsHandler } from "src/@types";
import { DevopsError } from "src/errors";
import { getProjectConfig } from "src/shared/config";
import { logger } from "src/shared/core";
import { useImageApi } from "src/shared/images";
import { askConfigureImageOptimization, askImageConfiguration } from "src/shared/interactive";
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
    case "configure": {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (!config) {
        await askConfigureImageOptimization(observations);
      } else {
        await askImageConfiguration(observations, api);
      }
      break;
    }

    case "optimize":
    case "convert": {
      if (config && config.rules) {
        await api.convert();
      } else {
        throw new DevopsError(
          `Attempt to call optimize before any rules were configured!`,
          "image/not-ready"
        );
      }
      break;
    }

    case "watch": {
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
    }

    case "summarize":
    case "summary": {
      await api.summarize();
      break;
    }

    case "": {
      if (config) {
        log.info(
          `- the valid sub-commands for {blue dd image} are: ${chalk.italic`config, optimize,`} and ${chalk.italic`watch`}`
        );
      }
      break;
    }

    default: {
      log.shout(
        subCommand
          ? `the subcommand '${subCommand}' is not known!`
          : `the ${chalk.bold.yellow`image`} command expects a ${chalk.italic`sub-command`}`
      );
      await asyncExec(`dd image --help`);
    }
  }

  await api.close();
};

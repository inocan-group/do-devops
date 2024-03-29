import chalk from "chalk";
import { DoDevopObservation, Options, TestObservation } from "src/@types";
import { askForUnitTestFramework, askConfirmQuestion } from "src/shared/interactive";
import { DevopsError } from "src/errors";
import { getProjectConfig, saveProjectConfig } from "src/shared/config";
import { logger } from "src/shared/core";
import { configureTestFramework, installTestFramework } from "src/shared/install";
import { emoji } from "src/shared/ui";

/**
 * Determines the unit testing framework being used in the current
 * working directory. If it can not determine then it will return `false`.
 */
export async function determineTestingFramework(
  observations: Set<DoDevopObservation>,
  opts: Options<{ interactive?: boolean }>
): Promise<TestObservation | false> {
  const log = logger(opts);
  const known: TestObservation[] = ["ava", "jasmine", "jest", "mocha", "qunit", "uvu"];
  for (const fw of known) {
    if (observations.has(fw)) {
      return fw;
    }
  }
  let config = getProjectConfig();
  if (config.test?.unitTestFramework) {
    if (opts.interactive) {
      log.shout(
        `- in the past, this project was setup to use the {yellow {bold ${config.test.unitTestFramework}}} unit test framework.`
      );
      log.shout(`- however, we can't detect the {bold npm} dependencies ${emoji.shocked}`);
      const install = await askConfirmQuestion("Install them now?");
      if (!install) {
        return config.test.unitTestFramework;
      }
    } else {
      log.info(
        `- the test framework is configured as "${config.test.unitTestFramework}" in your do-devops config file but we ${chalk.italic`don't detect`} the npm deps!`
      );
      return config.test.unitTestFramework;
    }
  }

  if (opts.interactive) {
    if (!config.test?.unitTestFramework) {
      const info = await askForUnitTestFramework(opts);
      if (!info) {
        return false;
      }
      config = await saveProjectConfig({ test: info });
    }
    if (!config.test) {
      throw new DevopsError(
        "Issue determining and/or saving test framework config!",
        "test/no-test-config"
      );
    }
    const installAndConfig = await askConfirmQuestion(
      `Install and configure ${chalk.italic(config.test.unitTestFramework)} test framework for you?`
    );
    if (!installAndConfig) {
      return config?.test?.unitTestFramework || false;
    }
    if (config?.test?.unitTestFramework) {
      const installed = await installTestFramework(
        config.test.unitTestFramework,
        opts,
        observations
      );
      const configured = await configureTestFramework(
        config?.test?.unitTestFramework,
        opts,
        observations
      );

      if (installed && configured) {
        log.info(
          `\n- ${emoji.party} ${chalk.green(config.test.unitTestFramework)} setup and ready to use in this repo!\n`
        );
      }
    }
  }
  return config && config.projectConfig && config.test?.unitTestFramework
    ? config.test.unitTestFramework
    : false;
}

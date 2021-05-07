import chalk from "chalk";
import { DoDevopObservation, IGlobalOptions, TestObservation } from "~/@types";
import { askForUnitTestFramework } from "~/commands/test/private";
import { DevopsError } from "~/errors";
import { getProjectConfig, saveProjectConfig } from "~/shared/config";
import { logger } from "~/shared/core";
import { askConfirmQuestion } from "~/shared/interactive";
import { configureTestFramework, installTestFramework } from "~/shared/testing";
import { emoji } from "~/shared/ui";

/**
 * Determines the unit testing framework being used in the current
 * working directory. If it can not determine then it will return `false`.
 */
export async function determineTestingFramework(
  observations: Set<DoDevopObservation>,
  opts: IGlobalOptions<{ interactive?: boolean }>
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
    if (!opts.interactive) {
      log.info(
        chalk`- the test framework is configured as "${config.test.unitTestFramework}" in your do-devops config file but we {italic don't detect} the npm deps!`
      );
      return config.test.unitTestFramework;
    } else {
      log.shout(
        chalk`- in the past, this project was setup to use the {yellow {bold ${config.test.unitTestFramework}}} unit test framework.`
      );
      log.shout(chalk`- however, we can't detect the {bold npm} dependencies ${emoji.shocked}`);
      const install = await askConfirmQuestion("Install them now?");
      if (!install) {
        return config.test.unitTestFramework;
      }
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
      chalk`Install and configure {italic ${config.test.unitTestFramework}} test framework for you?`
    );
    if (!installAndConfig) {
      return config.test.unitTestFramework;
    }
    const installed = await installTestFramework(config.test.unitTestFramework, opts, observations);
    const configured = await configureTestFramework(
      config.test.unitTestFramework,
      opts,
      observations
    );

    if (installed && configured) {
      log.info(
        chalk`- ${emoji.party} ${config.test.unitTestFramework} setup and ready to use in this repo!`
      );
    }
  }

  return config && config.projectConfig && config.test?.unitTestFramework
    ? config.test.unitTestFramework
    : false;
}

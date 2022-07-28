import { TestObservation, Observations, Options } from "src/@types";
import { DevopsError } from "src/errors";
import { templateDirCopy, templateFileCopy } from "src/shared/file";
import { getProjectConfig } from "../config";
import { logger } from "../core";

export async function configureTestFramework(
  framework: TestObservation,
  opts: Options,
  _observations: Observations
) {
  const log = logger(opts);
  const known: TestObservation[] = ["jest", "mocha", "uvu"];
  const config = getProjectConfig()?.test;

  if (!config || !config.unitTestFramework || !config.testDirectory) {
    throw new DevopsError(
      `Can't configure a test framework without the configuration saved to the project's config file.`,
      "test/not-ready"
    );
  }

  if (!known.includes(framework)) {
    log.shout(`- sorry but currently only know how to install: ${known.join(", ")}`);
    log.info(`- please ensure that you install the required dependencies for "${framework}"`);
    return false;
  }

  switch (framework) {
    case "uvu":
      await templateDirCopy("test/uvu/test-dir", config.testDirectory);
      break;
    case "jest":
      await templateDirCopy("test/jest/test-dir", config.testDirectory);
      await templateFileCopy("test/jest/jest.config.ts", "/jest.config.ts", {
        TEST_MATCHER: `["**/?(*)+(${config.testFilePostfix}).ts"]`,
        TEST_DIR: config.testDirectory,
      });
      await templateFileCopy("test/jest/wallaby.js", "/wallaby.js");
      break;
    case "mocha":
      await templateDirCopy("test/mocha/test-dir", config.testDirectory);
      break;
  }

  return true;
}

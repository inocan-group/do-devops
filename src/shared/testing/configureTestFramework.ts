import { TestObservation, Observations } from "~/@types";
import { DevopsError } from "~/errors";
import { templateDirCopy, templateFileCopy } from "~/shared/file";
import { getProjectConfig } from "../config";
import { logger } from "../core";

export async function configureTestFramework(
  framework: TestObservation,
  observations: Observations
) {
  const log = logger(observations);
  const known: TestObservation[] = ["jest", "mocha", "uvu"];
  const config = getProjectConfig()?.test;

  if (!config) {
    throw new DevopsError(
      `Can't configure a test framework without the configuration saved to the project's config file.`,
      "test/not-ready"
    );
  }

  if (!known.includes(framework)) {
    console.log(`- sorry but currently only know how to install: ${known.join(", ")}`);
    console.log(`- please ensure that you install the required dependencies for "${framework}"`);
    return false;
  }

  switch (framework) {
    case "uvu":
      await templateDirCopy("test/uvu/test-dir", "test");
      break;
    case "jest":
      await templateDirCopy("test/jest/test-dir", "test");
      await templateFileCopy("test/jest/jest.config.ts", "/jest.config.ts", {
        TEST_MATCHER: config.testPattern,
      });
      await templateFileCopy("test/jest/wallaby.js", "/wallaby.js");
  }
}

import { getProjectConfig } from "~/shared/config";
import { askForUnitTestFramework } from "../private";
import { DoDevopsHandler } from "~/@types/command";
import { ITestOptions } from "./options";
import { determineTestingFramework } from "~/shared/observations";
import { hasScript, installDevDep } from "~/shared/npm";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";
import { TestObservation } from "~/@types";
import { emoji } from "~/shared/ui";
import { logger } from "~/shared";

export const handler: DoDevopsHandler<ITestOptions> = async ({ raw, observations, opts }) => {
  const log = logger(opts);
  const config = getProjectConfig();
  let unitTestFramework = determineTestingFramework(observations, config);

  if (!unitTestFramework) {
    const answer = await askForUnitTestFramework();
    if (answer) {
      if (answer.fw === ("yarn" as TestObservation)) {
        const installed = await installDevDep(
          observations,
          "jest",
          "@jest/types",
          "jest-extended",
          "ts-jest"
        );
        if (!installed) {
          log.shout(`- ${emoji.angry} there was a problem installing jest dependencies!`);
          log.shout(`- please try again later or install offline`);
          return;
        }
      } else if (answer.fw === ("mocha" as TestObservation)) {
        installDevDep(observations, "mocha", "chai");
      }
    } else {
      // nothing more to do
      process.exit();
    }
  }

  if (hasScript("test")) {
    proxyToPackageManager("test", observations, raw);
  }
};

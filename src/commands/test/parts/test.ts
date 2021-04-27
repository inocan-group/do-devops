import chalk from "chalk";
import { getProjectConfig } from "~/shared/core";
import { askForUnitTestFramework } from "../private";
import { git } from "~/shared/git";
import { DoDevopsHandler } from "~/@types/command";
import { ITestOptions } from "./options";
import { determineTestingFramework } from "~/shared/observations";
import { getPackageJson } from "~/shared";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";

export const handler: DoDevopsHandler<ITestOptions> = async ({ opts, observations }) => {
  const config = getProjectConfig();
  let unitTestFramework = determineTestingFramework(observations, config);

  if (!unitTestFramework) {
    const answer = await askForUnitTestFramework();
    if (answer) {
      unitTestFramework = answer.fw;
    } else {
      // nothing more to do
      process.exit();
    }
  }

  if (hasScript("test")) {
    proxyToPackageManager("test", observations);
  }
};

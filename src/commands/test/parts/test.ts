import { getProjectConfig } from "~/shared/core";
import { askForUnitTestFramework } from "../private";
import { DoDevopsHandler } from "~/@types/command";
import { ITestOptions } from "./options";
import { determineTestingFramework } from "~/shared/observations";
import { hasScript } from "~/shared/npm";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";

export const handler: DoDevopsHandler<ITestOptions> = async ({ observations }) => {
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

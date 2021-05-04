import { DoDevopsHandler } from "~/@types/command";
import { ITestOptions } from "./options";
import { determineTestingFramework } from "~/shared/observations";
import { hasScript } from "~/shared/npm";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";
import { getProjectConfig, logger } from "~/shared";
import { exec } from "async-shelljs";

export const handler: DoDevopsHandler<ITestOptions> = async ({ raw, observations, opts, argv }) => {
  const log = logger(opts);
  const unitTestFramework = await determineTestingFramework(observations, {
    ...opts,
    interactive: true,
  });

  if (!unitTestFramework) {
    log.shout("- we couldn't determine a testing framework so exiting ...");
    return;
  }

  if (hasScript("test")) {
    proxyToPackageManager("test", observations, raw);
  } else {
    const config = getProjectConfig();
    let cmd: string;
    switch (unitTestFramework) {
      case "jest":
        cmd = `npx jest ${raw.join(" ")}`;
        break;
      case "uvu":
        cmd = `npx uvu ${config.test?.testDirectory} -r ts-node/register ${raw.join(" ")}`;
        break;
      case "mocha":
        cmd =
          argv.length === 0
            ? `mocha -r ts-node/register ${config.test?.testDirectory}/**/*${config.test?.testFilePostfix}.ts`
            : `mocha -r ts-node/register ${raw.join(" ")}`;
        break;
      default:
        console.log(
          `- currently do-devops is not setup to run tests with {bold {yellow ${unitTestFramework}}}`
        );
        return;
    }

    exec(cmd);
  }
};

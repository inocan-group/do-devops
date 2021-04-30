import chalk from "chalk";

import { DoDevopsHandler } from "~/@types/command";
import { IBuildOptions } from "./options";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";
import { askConfirmQuestion } from "~/shared/interactive";
import { installDevDep } from "~/shared/npm";
import { emoji } from "~/shared/ui";
import { findHandlerConfig, getValidServerlessHandlers } from "~/shared/ast";
import { reportOnFnConfig } from "~/commands/build/util";
import { logger } from "~/shared/core/logger";

export const defaultConfig = {
  preBuildHooks: ["clean"],
  targetDirectory: "dist",
  buildTool: "tsc",
};

export const handler: DoDevopsHandler<IBuildOptions> = async ({ observations, opts, raw }) => {
  const log = logger(opts);
  const serverless = observations.has("serverlessFramework");

  if (serverless) {
    if (!observations.has("serverlessTs")) {
      log.shout(
        chalk`{bold - in order to use the {yellow Serverless Devops} commands, you'll need to have a {blue serverless.ts} file in the root of your repo}`
      );
      log.info(
        chalk`{gray - to find more about this please refer to the docs: https://aws-orchestrate.com/devops}`
      );
      process.exit();
    }

    if (!observations.has("tsNode")) {
      log.shout(
        chalk`{bold - the handoff between your configuration in {blue serverless.ts} and the {yellow Serverless Devops} framework requires that you have {blue ts-node} installed as a dev dependency}`
      );
      const answer = await askConfirmQuestion("Add this dev dep?");
      if (answer) {
        const success = await installDevDep(observations, "ts-node");
        if (!success) {
          process.exit();
        }
      } else {
        process.exit();
      }
    }

    log.shout(chalk`{bold {yellow - ${emoji.run} Starting Serverless build process}}\n`);
    const fns = getValidServerlessHandlers(opts);
    if (fns.length === 0) {
      log.shout(
        chalk`- ${emoji.eyeballs} no lambda function handlers found; see docs for how to ensure your fns are found`
      );
      log.info(chalk`{gray - document can be found at {blue https://aws-orchestrate.com}}`);
      return;
    }

    log.info(chalk`- found {yellow {bold ${fns.length}}} lambda functions`);
    const fnConfig = fns.map((fn) => findHandlerConfig(fn));
    log.whisper(chalk`{gray - configuration blocks for lambda functions retrieved}`);
    const usage = reportOnFnConfig(fnConfig);
    if (usage.interfaces.has("IWrapperFunction")) {
      log.info(
        chalk`- ${emoji.robot} detected use of {italic deprecated} {inverse  IWrapperFunction } interface; please switch to {inverse  IHandlerConfig } instead.`
      );
    }
    log.info({ usage, handlers: usage.usage.handlersWithConfig });

    // await buildLambdaTypescriptProject(opts, config);
  } else {
    await proxyToPackageManager("build", observations, raw);
  }

  process.exit();
};

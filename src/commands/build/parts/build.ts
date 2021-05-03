import chalk from "chalk";

import { DoDevopsHandler } from "~/@types/command";
import { IBuildOptions } from "./options";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";
import { askConfirmQuestion } from "~/shared/interactive";
import { installDevDep } from "~/shared/npm";
import { emoji } from "~/shared/ui";
import { processLambdaFns } from "~/commands/build/util";
import { logger } from "~/shared/core/logger";
import { isValidServerlessTs } from "~/shared/file";

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

    if (!isValidServerlessTs()) {
      log.shout(
        chalk`{bold - in order for the build process to run your {blue serverless.ts} file must utilize the {yellow Serverless()}\n   configurator inside an asynchronous code block and be {italic transpilable} by Typescript's {bold tsc} compiler}`
      );

      log.info(
        chalk`{gray - to find more about this please refer to the docs: https://aws-orchestrate.com/devops}`
      );
      process.exit();
    }

    if (!observations.has("tsNode") || !observations.has("typescript")) {
      log.shout(
        chalk`{bold - the {italic handoff} between your configuration in {blue serverless.ts} and the build script in {yellow do-devops} requires that you have {blue ts-node} and {blue typescript} installed as a dev dependency in the repo.}`
      );
      const answer = await askConfirmQuestion("Add this dev dep?");
      if (answer) {
        const success = await installDevDep(observations, "ts-node", "typescript");
        if (!success) {
          log.info(`- please get these deps installed offline and then try build again`);

          process.exit();
        }
      } else {
        process.exit();
      }
    }

    log.shout(chalk`{bold - ${emoji.run} Starting {yellow Serverless Devops} build process}\n`);
    const env = getBuildEnvironment();
    await processLambdaFns(opts, observations);

    // await buildLambdaTypescriptProject(opts, config);
  } else {
    await proxyToPackageManager("build", observations, raw);
  }

  process.exit();
};

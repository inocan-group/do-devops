import chalk from "chalk";

import { DoDevopsHandler } from "~/@types/command";
import { IBuildOptions } from "./options";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";
import { askConfirmQuestion } from "~/shared/interactive";
import { installDevDep, hasScript } from "~/shared/npm";
import { emoji } from "~/shared/ui";
import { processLambdaFns, processStepFns } from "~/commands/build/util";
import { logger } from "~/shared/core/logger";
import { isValidServerlessTs } from "~/shared/file";
import { installBuildSystem } from "~/shared/install";

export const handler: DoDevopsHandler<IBuildOptions> = async ({ observations, opts, raw }) => {
  const log = logger(opts);
  const isServerless = observations.has("serverlessFramework");
  // if (observations.has("packageJson") && !observations.has("git-init") && !observations.has("pnpm-workspace")) {
  //   log.shout(
  //     chalk`- ${emoji.eyeballs} this repo appears to not have been initialized for git yet!`
  //   );
  //   await installGit(opts);
  //   observations = getObservations();
  // }
  // if (observations.has("packageJson") && !observations.has("gitignore")) {
  //   log.shout(chalk`- ${emoji.shocked} this repo appears to not have a {blue .gitignore} file!`);
  //   await installGitIgnore(opts);
  // }

  if (isServerless) {
    if (!observations.has("serverlessTs")) {
      log.shout(
        chalk`{bold - in order to use the {yellow Serverless Devops} commands, you'll need to have a {blue serverless.ts} file in the root of your repo}`
      );
      log.info(
        chalk`{gray - to find more about this please refer to the docs: https://aws-orchestrate.com/devops}`
      );
      return false;
    }

    if (!isValidServerlessTs(undefined, opts)) {
      log.shout(
        chalk`{bold - in order for the build process to run your {blue serverless.ts} file must produce a {italic default} export\n  of the {yellow Serverless()} configurator (exported in the {bold blue aws-orchestrate} library).}`
      );

      log.info(
        chalk`{gray - to find more about this please refer to the docs: https://aws-orchestrate.com/devops}`
      );
      return false;
    }

    if (!observations.has("tsNode") || !observations.has("typescript")) {
      log.shout(
        chalk`{bold - the {italic handoff} between your configuration in {blue serverless.ts} and the build script in {yellow do-devops} requires that you have {blue ts-node} and {blue typescript} installed as a dev dependency in the repo.}`
      );
      const answer = await askConfirmQuestion("Add this dev dep?");
      if (answer) {
        const success = await installDevDep(opts, observations, "ts-node", "typescript");
        if (!success) {
          log.info(`- please get these deps installed offline and then try build again`);

          return false;
        }
      } else {
        return false;
      }
    }

    log.shout(chalk`{bold - ${emoji.run} Starting {yellow Serverless Devops} build process}\n`);
    // const env = getBuildEnvironment(opts, observations);
    await processLambdaFns(opts, observations);
    await processStepFns(opts, observations);

    // await buildLambdaTypescriptProject(opts, config);
  } else {
    if (!hasScript("build") && !(await installBuildSystem(opts, observations))) {
      return false;
    }
    await proxyToPackageManager("build", observations, raw);
  }

  return true;
};

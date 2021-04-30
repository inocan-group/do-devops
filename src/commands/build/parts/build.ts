import chalk from "chalk";

import { DoDevopsHandler } from "~/@types/command";
import { IBuildOptions } from "./options";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";
import { askConfirmQuestion } from "~/shared/interactive";
import { installDevDep } from "~/shared/npm";

export const defaultConfig = {
  preBuildHooks: ["clean"],
  targetDirectory: "dist",
  buildTool: "tsc",
};

export const handler: DoDevopsHandler<IBuildOptions> = async ({ observations, raw }) => {
  const serverless = observations.has("serverlessFramework");

  if (serverless) {
    if (!observations.has("serverlessTs")) {
      console.log(
        chalk`{bold - in order to use the {yellow Serverless Devops} commands, you'll need to have a {blue serverless.ts} file in the root of your repo}`
      );
      console.log(
        chalk`{gray - to find more about this please refer to the docs: https://aws-orchestrate.com/devops}`
      );
      process.exit();
    }

    if (!observations.has("tsNode")) {
      console.log(
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

    console.log(chalk`{bold {yellow - Starting SERVERLESS build process}}\n`);

    // await buildLambdaTypescriptProject(opts, config);
  } else {
    await proxyToPackageManager("build", observations, raw);
  }

  process.exit();
};

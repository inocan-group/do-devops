import chalk from "chalk";

import { DoDevopsHandler } from "~/@types/command";
import { IBuildOptions } from "./options";
import { proxyToPackageManager } from "~/shared/core/proxyToPackageManager";

export const defaultConfig = {
  preBuildHooks: ["clean"],
  targetDirectory: "dist",
  buildTool: "tsc",
};

export const handler: DoDevopsHandler<IBuildOptions> = async ({ observations, raw }) => {
  const serverless = observations.includes("serverlessFramework");

  if (serverless) {
    console.log(chalk`{bold {yellow - Starting SERVERLESS build process}}\n`);

    // await buildLambdaTypescriptProject(opts, config);
  } else {
    await proxyToPackageManager("build", observations, raw);
  }

  process.exit();
};

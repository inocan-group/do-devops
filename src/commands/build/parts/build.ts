import chalk from "chalk";

import { DoDevopsHandler } from "~/@types/command";
import { IBuildOptions } from "./options";
import { determinePackageManager } from "~/shared/observations";
import { asyncExec } from "async-shelljs";

export const defaultConfig = {
  preBuildHooks: ["clean"],
  targetDirectory: "dist",
  buildTool: "tsc",
};

export const handler: DoDevopsHandler<IBuildOptions> = async ({ observations }) => {
  const serverless = observations.includes("serverlessFramework");

  if (serverless) {
    console.log(chalk`{bold {yellow - Starting SERVERLESS build process}}\n`);

    // await buildLambdaTypescriptProject(opts, config);
  } else {
    const pkgManager = await determinePackageManager(observations, true);
    if (pkgManager) {
      const cmd = `${pkgManager} build`;
      console.log(
        chalk`{gray - the primary utility of the {italic build} command is when paired with a Serverless project}`
      );
      console.log(
        chalk`{gray - since this project is not we will instead just proxy {blue ${cmd}} for you}\n`
      );
      asyncExec(cmd);
    }
    process.exit();
  }
};

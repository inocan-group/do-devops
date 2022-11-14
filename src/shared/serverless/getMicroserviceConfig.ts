import chalk from "chalk";
import path from "node:path";

import { DevopsError } from "src/errors";
import { IServerlessAccountInfo } from "src/@types";
import { asyncExec } from "async-shelljs";

/**
 * Gets the typescript configuration file for serverless
 * projects which use the `typescript-microservice` yeoman
 * template and generates a `serverless.yml` file from it.
 */
export async function getMicroserviceConfig(accountInfo: IServerlessAccountInfo) {
  const cliFile = path.join(process.env.PWD || "", "serverless-config", "build.ts");
  try {
    const config = await asyncExec(`yarn ts-node ${cliFile} '${JSON.stringify(accountInfo)}'`, {
      silent: true,
    });

    return config;
  } catch (error) {
    console.log(`{yellow - failed executing ${cliFile}}`);

    throw new DevopsError(
      `Problem getting the microservice config file [ ${cliFile} ]: ${(error as Error).message}`,
      "devops/missing-config"
    );
  }
}

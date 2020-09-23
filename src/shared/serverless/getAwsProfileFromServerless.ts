import chalk from "chalk";

import { DevopsError } from "../errors";
import { IServerlessConfig } from "common-types";
import { buildLambdaTypescriptProject } from "./index";
import { emoji } from "../ui";
import { getServerlessYaml } from "./getServerlessYaml";
import { isServerless } from "./isServerless";

/**
 * Returns the **AWS Profile** which is used as part
 * of the serverless configuration.
 *
 * If the project is detected to be a `serverless-microservice`
 * derived project then it will build the configuration first if
 * the serverless.yml is missing.
 */
export async function getAwsProfileFromServerless() {
  const sls = await isServerless();
  let config: IServerlessConfig;
  if (!sls) {
    throw new DevopsError(
      `Attempt to get the AWS profile from the serverless config failed because this project is not setup as a serverless project!`,
      "devops/not-allowed"
    );
  }

  if (
    (!sls.hasServerlessConfig || !sls.hasProviderSection) &&
    sls.isUsingTypescriptMicroserviceTemplate
  ) {
    if (!sls.hasServerlessConfig) {
      console.log(
        chalk`- it appears that the {green serverless.yml} {italic does not} exist; will build from {italic serverless-microservice} config ${emoji.robot}`
      );
    } else {
      console.log(
        chalk`- it appears that the {green serverless.yml} does not have the {bold provider} section; will build from {italic serverless-microservice} config ${emoji.robot}`
      );
    }

    await buildLambdaTypescriptProject();
  }

  try {
    config = await getServerlessYaml();
    if (!config.provider) {
      console.log(
        chalk`- the {red serverless.yaml} file doesn't have a {bold provider} section! ${emoji.poop}`
      );
      console.log("- this section must exist before you can deploy\n");
      process.exit();
    }
    return config.provider.profile;
  } catch (e) {
    console.log(chalk`- {red serverless.yml} file is missing! ${emoji.poop}`);
    console.log(`- this file must exist before you can deploy\n`);
    process.exit();
  }
}

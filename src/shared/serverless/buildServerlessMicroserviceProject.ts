import { getMicroserviceConfig } from "./getMicroserviceConfig";
import {
  getAccountInfoFromServerlessYaml,
  askForAccountInfo,
  saveToServerlessYaml
} from ".";
import chalk from "chalk";
import { IServerlessAccountInfo } from "../@types";
import { IServerlessConfig } from "common-types";
import { emoji } from "../ui";

/**
 * Builds a `serverless.yml` file from the configuration
 * available in the `/serverless-config` directory.
 *
 * The key requirement here is that the `accountInfo` hash is
 * built out. This information will be gathered from the
 * following sources (in this order):
 *
 * 1. look within the `serverless.yml` for info (if it exists)
 * 2. ask the user for the information (saving values as default for next time)
 */
export async function buildServerlessMicroserviceProject() {
  const accountInfo =
    (await getAccountInfoFromServerlessYaml()) || (await askForAccountInfo());
  console.log(
    chalk`- The account info for {bold ${accountInfo.name} [ }{dim ${
      accountInfo.accountId
    }} {bold ]} {bold ]} has been gathered; ready to build {green serverless.yml}`
  );
  const config = (await getMicroserviceConfig(accountInfo)).replace(
    /^.*\}\'(.*)/,
    "$1"
  );
  try {
    const configComplete: IServerlessConfig = JSON.parse(config);
    await saveToServerlessYaml(configComplete);
    console.log(
      chalk`- The {green {bold serverless.yml}} file has been updated! ${
        emoji.rocket
      }`
    );

    return configComplete;
  } catch (e) {
    console.log(
      chalk`- {red the attempt to parse the serverless config has failed!} ${
        emoji.poop
      }`
    );
    console.log(e.message);
    console.log(chalk`{dim ${e.stack}}`);
    console.log();

    process.exit();
  }
}

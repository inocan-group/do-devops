import { getMicroserviceConfig } from "./getMicroserviceConfig";
import {
  getAccountInfoFromServerlessYaml,
  askForAccountInfo,
  saveToServerlessYaml,
  saveFunctionsTypeDefinition
} from ".";
import chalk from "chalk";
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
  let stage = "starting";
  const accountInfo =
    (await getAccountInfoFromServerlessYaml()) || (await askForAccountInfo());
  console.log(
    chalk`- The account info for {bold ${accountInfo.name} [ }{dim ${
      accountInfo.accountId
    }} {bold ]} has been gathered; ready to build {green serverless.yml}`
  );

  try {
    const config = (await getMicroserviceConfig(accountInfo)).replace(
      /^.*\}\'(.*)/,
      "$1"
    );

    stage = "config-returned";
    const configComplete: IServerlessConfig = JSON.parse(config);
    stage = "config-parsed";

    await saveFunctionsTypeDefinition(configComplete);
    console.log(
      chalk`- The function enumeration at {bold src/@types/build.ts} has been updated`
    );
    stage = "type-definitions-written";
    await saveToServerlessYaml(configComplete);
    console.log(
      chalk`- The {green {bold serverless.yml}} file has been updated! ${
        emoji.rocket
      }\n`
    );

    return configComplete;
  } catch (e) {
    console.log(
      chalk`- {red the attempt to parse the serverless config has failed at stage "${stage}"!} ${
        emoji.poop
      }`
    );
    console.log(
      `- The config sent in was:\n${JSON.stringify(accountInfo, null, 2)}`
    );

    console.log("- " + e.message);
    console.log(chalk`{dim ${e.stack}}`);
    console.log();

    process.exit();
  }
}

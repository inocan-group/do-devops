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
    chalk`- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered; ready to build {green serverless.yml}`
  );

  try {
    const config = (await getMicroserviceConfig(accountInfo)).replace(
      /^.*\}\'(.*)/,
      "$1"
    );

    stage = "config-returned";
    let configComplete: IServerlessConfig;

    try {
      configComplete = JSON.parse(config);
    } catch (e) {
      console.log(
        chalk`- {yellow Warning:} parsing the configuration caused an error ${emoji.shocked}`
      );
      console.log(
        chalk`{dim - will make second attempt with more aggressive regex}`
      );

      try {
        const strippedOut = config.replace(/(.*)\{"service.*/, "$1");
        const newAttempt = config.replace(/.*(\{"service.*)/, "$1");
        configComplete = JSON.parse(newAttempt);
        console.log(
          chalk`- by removing some of the text at the beginning we {bold were} able to parse the config ${emoji.thumbsUp}`
        );
        console.log(chalk`- the text removed was:\n{dim ${strippedOut}}`);
      } catch (e) {
        console.log(
          chalk`{red - Failed {italic again} to parse the configuration file!}`
        );
        console.log(`- Error message was: ${e.message}`);
        console.log(
          chalk`- The config that is being parsed is:\n\n${config}\n`
        );
        process.exit();
      }
    }
    stage = "config-parsed";

    await saveFunctionsTypeDefinition(configComplete);
    console.log(
      chalk`- The function enumeration at {bold src/@types/build.ts} has been updated`
    );
    stage = "type-definitions-written";
    await saveToServerlessYaml(configComplete);
    console.log(
      chalk`- The {green {bold serverless.yml}} file has been updated! ${emoji.rocket}\n`
    );

    return configComplete;
  } catch (e) {
    console.log(
      chalk`- {red the attempt to parse the serverless config has failed at stage "${stage}"!} ${emoji.poop}`
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

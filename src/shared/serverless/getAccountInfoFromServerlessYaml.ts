import { getServerlessYaml } from "./getServerlessYaml";
import { IServerlessAccountInfo } from "../@types";
import chalk from "chalk";

/**
 * Gets the `accountInfo` from the `serverless.yml` file if
 * possible. If not it returns nothing.
 */
export async function getAccountInfoFromServerlessYaml() {
  try {
    const config = await getServerlessYaml();
    const info = {
      name:
        typeof config.service === "string"
          ? config.service
          : config.service.name,
      accountId: config.custom.accountId,
      region: config.provider.region,
      profile: config.provider.profile
    } as IServerlessAccountInfo;
    if (config.custom.logForwarding) {
      info.logForwarding = config.custom.logForwarding.destinationARN;
    }
    try {
      const sls = await getServerlessYaml();
      info.pluginsInstalled = sls.plugins;
      if (!sls.plugins.includes("serverless-webpack")) {
        console.log(
          chalk`{red - it is {italic strongly} recommended that you install and use the {bold {blue serverless-webpack}} plugin!}`
        );
      }
    } catch (e) {
      info.pluginsInstalled = [];
    }

    return info;
  } catch (e) {
    console.log(
      chalk`- Problems getting account info from {green serverless.yml}.`
    );
  }
}

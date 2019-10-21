import { getServerlessYaml } from "./getServerlessYaml";
import chalk from "chalk";
import { IServerlessAccountInfo } from "../../@types";

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
          chalk`{yellow {bold 
            - it is recommended that you use {blue webpack} in some form. }}
            - The most common means of doing this requires you install the {bold {blue serverless-webpack}} plugin}}
            - However, just installing {bold blue webpack}} will allow {italic {bold do-devops}} to build/tree-shake with webpack
          `
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

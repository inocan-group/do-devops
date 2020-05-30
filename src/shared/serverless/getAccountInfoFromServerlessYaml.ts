import * as chalk from "chalk";

import { IServerlessAccountInfo } from "../../@types";
import { getServerlessYaml } from "./getServerlessYaml";

/**
 * Gets the `accountInfo` from the `serverless.yml` file if
 * possible. If not it returns nothing.
 */
export async function getAccountInfoFromServerlessYaml() {
  try {
    const config = await getServerlessYaml();
    const info = {
      name: typeof config.service === "string" ? config.service : config.service.name,
      accountId: config.custom.accountId,
      region: config.provider.region,
      profile: config.provider.profile,
      pluginsInstalled: config.plugins || [],
      // tracing: (config as any).tracing
    } as IServerlessAccountInfo;

    if (config.custom.logForwarding) {
      info.logForwarding = config.custom.logForwarding.destinationARN;
    }

    return info;
  } catch (e) {
    console.log(chalk`- Problems getting account info from {green serverless.yml}.`);
  }
}

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
    return {
      name: config.service,
      accountId: config.custom.accountId,
      region: config.provider.region,
      profile: config.provider.profile
    } as IServerlessAccountInfo;
  } catch (e) {
    console.log(
      chalk`- Problems getting account info from {green serverless.yml}.`
    );
    //
  }
}

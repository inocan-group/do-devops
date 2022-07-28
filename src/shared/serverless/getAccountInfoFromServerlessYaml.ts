import { IServerlessAccountInfo } from "src/@types";
import { DevopsError } from "src/errors";
import { getServerlessYaml } from "./getServerlessYaml";

/**
 * Gets the `accountInfo` from the `serverless.yml` file if
 * possible. If not it returns an empty object.
 */
export async function getAccountInfoFromServerlessYaml(): Promise<IServerlessAccountInfo> {
  try {
    const config = await getServerlessYaml();
    const info = {
      name: typeof config.service === "string" ? config.service : config.service.name,
      accountId: config?.custom?.accountId,
      region: config.provider.region,
      profile: config.provider.profile,
      pluginsInstalled: config.plugins || [],
      // tracing: (config as any).tracing
    } as IServerlessAccountInfo;

    if (config?.custom?.logForwarding) {
      info.logForwarding = config.custom.logForwarding.destinationARN;
    }

    return info;
  } catch (error) {
    throw new DevopsError(
      `Problems getting serverless.yml's account info: ${(error as Error).message}`,
      "serverless-framework/account-info"
    );
  }
}

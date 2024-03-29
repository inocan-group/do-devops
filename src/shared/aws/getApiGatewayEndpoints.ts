import { APIGateway, ApiGatewayV2 } from "./aws-proxy";
import { convertProfileToApiCredential, getAwsProfile } from "./index";
import { emoji } from "../ui";
import { userHasAwsProfile } from "./userHasAwsProfile";
import chalk from "chalk";

/**
 * Gets all API Gateway _endpoints_ defined in a given
 * AWS profile/account.
 */
export async function getApiGatewayEndpoints(profileName: string, region: string) {
  if (!userHasAwsProfile(profileName)) {
    console.log(
      `- attempt to get ${chalk.italic`endpoints`} not possible with the profile ${chalk.blue`${profileName}`} as you do not have credentials defined for this profile! ${emoji.angry}\n`
    );
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
  }
  const profile = await getAwsProfile(profileName);
  const credential = convertProfileToApiCredential(profile);

  const gw = new APIGateway({
    ...credential,
    region,
  });

  const gw2 = new ApiGatewayV2({
    ...credential,
    region,
  });

  const restApi = await gw.getRestApis().promise();
  const httpApi = await gw2.getApis().promise();
  // const detail = await gw.getRestApi({ restApiId: apis.items[0].apiKeySource });
  return { httpApi, restApi };
}

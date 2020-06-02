import { APIGateway, ApiGatewayV2 } from "aws-sdk";
import { convertProfileToApiCredential, getAwsProfile } from "./index";

import { emoji } from "../ui";
import { userHasAwsProfile } from "./userHasAwsProfile";

import chalk = require("chalk");

/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
export async function getApiGatewayEndpoints(profileName: string, region: string) {
  if (!userHasAwsProfile(profileName)) {
    console.log(
      chalk`- attempt to get {italics endpoints} not possible with the profile {blue ${profileName}} as you do not have credentials defined for this profile! ${emoji.angry}\n`
    );
    process.exit();
  }
  const profile = await getAwsProfile(profileName);
  const credential = convertProfileToApiCredential(profile);

  const gw = new APIGateway({
    ...credential,
    region,
  });

  const apis = await gw.getRestApis().promise();
  console.log(JSON.stringify(apis, null, 2));

  const detail = await gw.getRestApi({ restApiId: apis.items[0].apiKeySource });
  return detail;
}

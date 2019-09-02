import { ApiGatewayV2, APIGateway } from "aws-sdk";
import { getAwsProfile, convertProfileToApiCredential } from "./index";

/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
export async function getApiGatewayEndpoints(
  profileName: string,
  region: string
) {
  const profile = convertProfileToApiCredential(
    await getAwsProfile(profileName)
  );

  const gw = new APIGateway({
    ...profile,
    region
  });

  const apis = await gw.getRestApis().promise();
  const detail = await gw.getRestApi({ restApiId: apis.items[0].apiKeySource });
  return detail;
}

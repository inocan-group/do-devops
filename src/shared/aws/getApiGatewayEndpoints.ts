import { ApiGatewayV2, APIGateway } from "aws-sdk";
import { determineRegion } from "../serverless";
import { IDictionary } from "common-types";
import { getAwsProfile, convertProfileToApiCredential } from "./index";
import { determineProfile } from "../serverless/index";

/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
export async function getApiGatewayEndpoints(
  profileName: string,
  region?: string
) {
  const profile = convertProfileToApiCredential(
    await getAwsProfile(profileName)
  );

  // const gw = new ApiGatewayV2({
  //   apiVersion: "2018-11-29",
  //   ...profile
  // });

  // const result = await gw.getApis().promise();
  const gw = new APIGateway({
    ...profile
  });
  const result = await gw.getRestApis().promise();
  console.log("result", result);

  return result.items;
}

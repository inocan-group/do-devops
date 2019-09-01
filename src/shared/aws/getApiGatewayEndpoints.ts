import { ApiGatewayV2 } from "aws-sdk";
import { determineRegion } from "../serverless";
import { IDictionary } from "common-types";
import { getAwsProfile } from "./index";
import { determineProfile } from "../serverless/index";

/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
export async function getApiGatewayEndpoints(opts?: {
  cliOptions?: {
    region?: string;
    profile?: string;
    stage?: string;
  };
  interactive?: boolean;
}) {
  const profileName = await determineProfile(opts);
  const profile = await getAwsProfile(profileName);
  const region = await determineRegion(opts);

  const gw = new ApiGatewayV2({
    apiVersion: "2018-11-29",
    secretAccessKey: profile.aws_secret_access_key,
    accessKeyId: profile.aws_access_key_id
  });

  const result = await gw.getApis().promise();

  return result.Items;
}

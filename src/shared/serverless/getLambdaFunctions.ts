import { Lambda } from "aws-sdk";
import { determineRegion } from "./determineRegion";
import { IDictionary } from "common-types";
import { getAwsProfile, convertProfileToApiCredential } from "../aws";
import { determineProfile } from "./determineProfile";

/**
 * Uses the AWS Lambda API to retrieve a list of functions for given
 * profile/region.
 */
export async function getLambdaFunctions(opts: IDictionary = {}) {
  const region = await determineRegion({ cliOptions: opts });
  const profileName = await determineProfile({ cliOptions: opts });
  const profile = convertProfileToApiCredential(
    await getAwsProfile(profileName)
  );
  const lambda = new Lambda({
    apiVersion: "2015-03-31",
    region,
    ...profile
  });

  const fns = await lambda.listFunctions().promise();
  return fns.Functions;
}

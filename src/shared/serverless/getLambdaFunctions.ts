import { Lambda } from "aws-sdk";
import { AwsRegion } from "common-types";
import { getAwsProfile, convertProfileToApiCredential } from "../aws";
import { determineRegion, determineProfile } from "~/shared/observations";

export interface ILambdaFunctionsOptions {
  /** explicitly state the region you are interested in */
  region?: AwsRegion;
  /** explicitly state the AWS profile to use */
  profile?: string;
}

/**
 * **getLambdaFunctions**
 *
 * Returns an array of lambda functions for a given AWS _profile_ and
 * _region_.
 *
 * The options hash allows you to state explicitly which profile/region but if you
 * skip this then an attempt will be made to figure it out based on
 * ENV variables and files in the working directory.
 */
export async function getLambdaFunctions(
  opts: ILambdaFunctionsOptions = {}
): Promise<Lambda.FunctionConfiguration[]> {
  const region = opts.region ? opts.region : await determineRegion(opts);
  const profileName = await determineProfile(opts);
  const profile = convertProfileToApiCredential(await getAwsProfile(profileName));
  const lambda = new Lambda({
    apiVersion: "2015-03-31",
    region,
    ...profile,
  });

  const fns = await lambda.listFunctions().promise();
  return fns.Functions || [];
}

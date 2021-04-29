import { Lambda } from "aws-sdk";
import { IAwsOptions } from "~/@types/aws";
import { DevopsError } from "~/errors/index";
import { determineProfile, determineRegion } from "../observations";
import { convertProfileToApiCredential } from "./convertProfileToApiCredential";
import { getAwsProfile } from "./getAwsProfile";

/**
 * Gets a list of AWS Lambda functions from a given AWS
 * profile and region. This list is provided using the
 * AWS CLI.
 */
export async function getAwsLambdaFunctions(opts: IAwsOptions) {
  const profile = opts.profile ? opts.profile : await determineProfile(opts);
  const region = opts.region ? opts.region : await determineRegion(opts);

  if (!profile || !region) {
    throw new DevopsError(
      `Requesting a list of AWS functions requires an AWS profile and a specified region. One or both were missing [ p: ${profile}, r: ${region}] `,
      "not-ready/missing-aws-properties"
    );
  }

  const credentials = convertProfileToApiCredential(await getAwsProfile(profile));
  const lambda = new Lambda({ ...credentials, region });

  return lambda.listFunctions().promise();
}

import { getAwsUserProfile } from "./getAwsUserProfile";
import { AwsAccountId } from "common-types";

/**
 * Using the AWS sdk to get the current AWS user's record
 * -- which the user should have _rights to_ -- we can parse
 * out the AWS Account ID.
 */
export async function getAwsAccountId(awsProfile: string) {
  const user = await getAwsUserProfile(awsProfile);
  const [_, accountId] = user.Arn.match(/arn.*::(\d+):.*/) as [string, string];

  return accountId as AwsAccountId;
}

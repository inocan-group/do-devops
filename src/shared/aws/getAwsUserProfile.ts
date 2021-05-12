import { IAM } from "aws-sdk";
import { getAwsProfile } from "./getAwsProfile";
import { IAwsProfile } from "../../@types";

/**
 * Uses the AWS SDK to get the user's profile information.
 *
 * @param awsProfile you may pass in the _string_ name of the profile or the profile itself
 */
export async function getAwsUserProfile(
  awsProfile: IAwsProfile | string
): Promise<IAM.GetUserResponse["User"]> {
  if (typeof awsProfile === "string") {
    awsProfile = await getAwsProfile(awsProfile);
  }

  const up = await new IAM({
    accessKeyId: (awsProfile as IAwsProfile).aws_access_key_id,
    secretAccessKey: (awsProfile as IAwsProfile).aws_secret_access_key,
  })
    .getUser()
    .promise();

  return up.User;
}

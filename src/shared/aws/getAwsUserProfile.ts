import { IAM } from "aws-sdk";
import { IAwsProfile } from "./getAwsProfile";

export async function getAwsUserProfile(awsProfile: IAwsProfile) {
  const up = new IAM({
    accessKeyId: awsProfile.aws_access_key_id,
    secretAccessKey: awsProfile.aws_secret_access_key
  })
    .getUser()
    .promise();

  return up;
}

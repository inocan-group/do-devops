import { IAwsProfile } from "~/@types";
import AWS from "aws-sdk";
/**
 * Returns the `userId`, `accountId`, `arn`, and `user` when passed
 * the key/secret key found in a user's `~/.aws/credentials` file.
 *
 * @param profile a profile from a user's `credentials` file
 */
export async function getAwsIdentityFromProfile(profile: IAwsProfile) {
  const sts = new AWS.STS({
    accessKeyId: profile.aws_access_key_id,
    secretAccessKey: profile.aws_secret_access_key,
  });
  const result = await sts.getCallerIdentity().promise();
  return {
    userId: result.UserId,
    accountId: result.Account,
    arn: result.Arn,
    user: (result.Arn as string).split(":").pop(),
  };
}

// STS: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/STS.html
// getCallerIdentity: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/STS.html#getCallerIdentity-property

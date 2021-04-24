import { IAwsProfile, ICredentialOptions } from "../../@types";

/**
 * converts the `IAwsProfile` format (which mimics what you have in the credentials file) and
 * converts it to something that resembles the AWS `CredentialsOptions` and can be used
 * directly in credentializing an API call
 */
export function convertProfileToApiCredential(
  profile: IAwsProfile | false
): ICredentialOptions | false {
  return profile
    ? {
        accessKeyId: profile.aws_access_key_id,
        secretAccessKey: profile.aws_secret_access_key,
      }
    : false;
}

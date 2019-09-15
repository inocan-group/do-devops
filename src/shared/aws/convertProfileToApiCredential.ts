import { IAwsProfile, ICredentialOptions } from "../../@types";

const credentialMap = {
  aws_access_key_id: "accessKeyId",
  aws_secret_access_key: "secretAccessKey"
};

/**
 * converts the `IAwsProfile` format (which mimics what you have in the credentials file) and
 * converts it to something that resembles the AWS `CredentialsOptions` and can be used
 * directly in credentializing an API call
 */
export function convertProfileToApiCredential(profile: IAwsProfile) {
  return Object.keys(profile).reduce(
    (agg: Partial<ICredentialOptions>, key: keyof IAwsProfile) => {
      if (key !== "region") {
        agg[credentialMap[key] as keyof ICredentialOptions] = profile[key];
      }
      return agg;
    },
    {}
  ) as ICredentialOptions;
}

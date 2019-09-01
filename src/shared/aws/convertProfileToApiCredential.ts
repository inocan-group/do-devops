import { IAwsProfile, ICredentialOptions } from "../../@types";

const credentialMap = {
  aws_access_key_id: "accessKeyId",
  aws_secret_access_key: "secretAccessKey"
};

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

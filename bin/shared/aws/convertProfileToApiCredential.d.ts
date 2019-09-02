import { IAwsProfile, ICredentialOptions } from "../../@types";
/**
 * converts the `IAwsProfile` format (which mimics what you have in the credentials file) and
 * converts it to something that resembles the AWS `CredentialsOptions` and can be used
 * directly in credentializing an API call
 */
export declare function convertProfileToApiCredential(profile: IAwsProfile): ICredentialOptions;

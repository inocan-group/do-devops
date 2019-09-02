/**
 * The format of properties found in the `~/.aws/credentials` file
 */
export interface IAwsProfile {
    aws_access_key_id: string;
    aws_secret_access_key: string;
    region?: string;
}
/**
 * Parameters used in the `aws-sdk` which credentialize
 * the API request.
 */
export declare type ICredentialOptions = {
    /**
     * AWS access key ID.
     */
    accessKeyId: string;
    /**
     * AWS secret access key.
     */
    secretAccessKey: string;
    /**
     * AWS session token.
     */
    sessionToken?: string;
};

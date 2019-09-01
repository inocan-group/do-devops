import { IDictionary } from "common-types";
export interface IAwsProfile {
    aws_access_key_id: string;
    aws_secret_access_key: string;
    region?: string;
}
/**
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 *
 * Returns _false_ if the credentials file is not found.
 */
export declare function getAwsProfileList(): Promise<false | IDictionary<IAwsProfile>>;

import { IDictionary } from "common-types";
/**
 * Gets the "default" profile for a given repo based on:
 *
 * - the `serverless.yml` file
 * - the `do.config.js` file
 *
 * If not found it will switch over to _interactive mode_.
 */
export declare function getDefaultAwsProfile(): Promise<void>;
/**
 * Returns the path to the file if found, if not found then returns
 * `false`.
 */
export declare function hasAwsProfileCredentialsFile(): string | false;
export interface IAwsProfile {
    aws_access_key_id: string;
    aws_secret_access_key: string;
    region?: string;
}
/**
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 * Returns _false_ if the credentials file is not found.
 */
export declare function getAwsProfileList(): Promise<IDictionary<IAwsProfile> | false>;
/**
 * Get a specific _named profile_ in the AWS `credentials` file
 */
export declare function getAwsProfile(profileName: string): Promise<IAwsProfile>;
/**
 * Asks the user to choose an AWS profile
 */
export declare function askForAwsProfile(): Promise<string>;
/**
 * Asks the user to choose an AWS region
 */
export declare function askForAwsRegion(): Promise<string>;

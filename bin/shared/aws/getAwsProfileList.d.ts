import { IDictionary } from "common-types";
import { IAwsProfile } from "../../@types";
/**
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 *
 * Returns _false_ if the credentials file is not found.
 */
export declare function getAwsProfileList(): Promise<false | IDictionary<IAwsProfile>>;

import { IAwsProfile } from "../../@types";
import { IDictionary } from "common-types";
/**
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 */
export declare function getAwsProfileList(): Promise<false | IDictionary<IAwsProfile>>;

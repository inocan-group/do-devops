import { IAwsProfile } from "../../@types";
/**
 * Returns the `userId`, `accountId`, `arn`, and `user` when passed
 * the key/secret key found in a user's `~/.aws/credentials` file.
 *
 * @param profile a profile from a user's `credentials` file
 */
export declare function getAwsIdentityFromProfile(profile: IAwsProfile): Promise<{
    userId: string;
    accountId: string;
    arn: string;
    user: string;
}>;

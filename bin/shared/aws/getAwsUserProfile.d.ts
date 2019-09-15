import { IAM } from "aws-sdk";
import { IAwsProfile } from "../../@types";
/**
 * Uses the AWS SDK to get the user's profile information.
 *
 * @param awsProfile you may pass in the _string_ name of the profile or the profile itself
 */
export declare function getAwsUserProfile(awsProfile: IAwsProfile | string): Promise<import("aws-sdk/lib/request").PromiseResult<IAM.GetUserResponse, import("aws-sdk").AWSError>>;

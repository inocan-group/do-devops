import { IAM } from "aws-sdk";
import { IAwsProfile } from "./getAwsProfile";
export declare function getAwsUserProfile(awsProfile: IAwsProfile): Promise<import("aws-sdk/lib/request").PromiseResult<IAM.GetUserResponse, import("aws-sdk").AWSError>>;

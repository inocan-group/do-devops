import { IAwsProfile } from "../../@types";
/** adds a new profile to a user's `~/.aws/credentials` file */
export declare function addAwsProfile(name: string, profile: IAwsProfile): void;

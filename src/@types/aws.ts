import { AwsArnPartition, AwsRegion, AwsStage } from "common-types";

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
export type IAwsCredentials = {
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

export interface IAwsOptions {
  /** the AWS profile to use to credentialize the deployment */
  profile?: string;
  /** the AWS region that is being defaulted to */
  region?: AwsRegion;
  /** the AWS stage being targetted */
  stage?: AwsStage;
  /** The AWS partition being targetted */
  partition?: AwsArnPartition;
  /**
   * If observsation can't be made then fall back to using
   * interactive prompts to ask the user.
   */
  interactive?: boolean;
}

import { IAwsCredentials, IAwsProfile } from "src/@types";

/**
 * Type guard which detects whether a give input is a `IAwsProfile` object
 * representing the data in a credentials file in a snake_case fashion.
 */
export function isAwsProfile(input: unknown): input is IAwsProfile {
  return (
    typeof input === "object" &&
    input !== null &&
    Object.keys(input).includes("aws_access_key_id") &&
    Object.keys(input).includes("aws_secret_access_key")
  );
}

/**
 * Type guard which detects whether a give input is a `IAwsCred` object
 * representing the data in a credentials file in a snake_case fashion.
 */
export function isAwsCredentials(input: unknown): input is IAwsCredentials {
  return (
    typeof input === "object" &&
    input !== null &&
    Object.keys(input).includes("accessKeyId") &&
    Object.keys(input).includes("secretAccessKey")
  );
}

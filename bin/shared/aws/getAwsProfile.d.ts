/**
 * Get a specific _named profile_ in the AWS `credentials` file;
 * throws `devops/not-ready` if error.
 */
export declare function getAwsProfile(profileName: string): Promise<import("../..").IAwsProfile>;

export interface IDoSsmConfig {
  /** AWS's CLI must be installed to do anything with SSM */
  hasAwsInstalled: boolean;
  /**
   * When trying to decide what "profile" to use for AWS,
   * this configuration indicates what type of project this is
   * and therefore where the `profile` might be found
   */
  findProfileIn?: "default" | "serverless-yaml" | "typescript-microservice";
  /**
   * If the `findProfileIn` hint doesn't detect a profile then the fallback
   * is the `defaultProfile`
   */
  defaultProfile?: string;
}

export function ssm() {
  return {};
}

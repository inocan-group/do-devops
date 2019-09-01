/**
 * Returns the **AWS Profile** which is used as part
 * of the serverless configuration.
 *
 * If the project is detected to be a `serverless-microservice`
 * derived project then it will build the configuration first if
 * the serverless.yml is missing.
 */
export declare function getAwsProfileFromServerless(): Promise<string>;

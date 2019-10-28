/**
 * Gets the list of functions defined in the `serverless.yml`
 * file.
 */
export declare function getLocalServerlessFunctionsFromServerlessYaml(): Promise<import("common-types").IDictionary<import("common-types").IServerlessFunction>>;

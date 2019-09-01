export interface IIsServerless {
    /** validates that the `serverless.yml` file exists */
    hasServerlessConfig: boolean;
    /**
     * Indicates whether the Serverless framework's npm module
     * is in the **devDeps** section of the package.json.
     */
    hasAsDevDep: boolean;
    /**
     * Indicates whether this project was originated from the
     * `typescript-microservice` yeoman template
     */
    isUsingTypescriptMicroserviceTemplate: boolean;
    /**
     * the **provider** section is critical and sometimes the `serverless.yml` file
     * might exist but if it doesn't have this section then this is typically
     * problematic.
     */
    hasProviderSection: boolean;
    /** indicates that the `serverless.yml` file not only exists but is parsable */
    configIsParsable: boolean;
}
/**
 * returns a set of flags indicating whether it appears the serverless framework
 * is being used in this repo
 */
export declare function isServerless(): Promise<IIsServerless | false>;

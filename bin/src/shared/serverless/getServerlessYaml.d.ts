import { IServerlessConfig } from "common-types";
/**
 * Get the `serverless.yml` file in the root of the project
 */
export declare function getServerlessYaml(): Promise<IServerlessConfig>;

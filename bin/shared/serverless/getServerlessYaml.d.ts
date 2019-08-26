import { IServerlessConfig } from "common-types";
/**
 * Get the `serverless.yml` file in the root of the project; if
 * the file does not exist then return _false_
 */
export declare function getServerlessYaml(): Promise<IServerlessConfig>;

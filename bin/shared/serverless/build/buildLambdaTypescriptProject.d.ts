import { IDictionary, IServerlessAccountInfo, IServerlessConfig } from "common-types";
import { IDoBuildConfig } from "../../../@types";
/**
 * Builds a `serverless.yml` file from the configuration
 * available in the `/serverless-config` directory.
 *
 * The key requirement here is that the `accountInfo` hash is
 * built out. This information will be gathered from the
 * following sources (in this order):
 *
 * 1. look within the `serverless.yml` for info (if it exists)
 * 2. ask the user for the information (saving values as default for next time)
 */
export declare function buildLambdaTypescriptProject(opts?: IDictionary, config?: IDoBuildConfig, 
/** modern scaffolding will pass in the config function to be managed here in this process */
configFn?: (c: IServerlessAccountInfo) => IServerlessConfig): Promise<void>;

import { IServerlessDeployMeta } from "./deploy-serverless";
/**
 * Tests whether webpack transpilation is needed
 * based on the timestamps of the source and transpiled files
 *
 * @param meta the meta information from CLI
 * @param fns optionally pass in a subset of functions which are being deployed
 */
export declare function isTranspileNeeded(meta: IServerlessDeployMeta, fns?: string[]): string[];

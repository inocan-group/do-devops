import { IDetermineOptions } from "../../../bin/src/@types/general";
/**
 * Determines the appropriate `region` to point at based on CLI switches/options,
 * the Serverless configuration, and the global `do` config defaults.
 */
export declare function determineRegion(opts: IDetermineOptions): Promise<any>;

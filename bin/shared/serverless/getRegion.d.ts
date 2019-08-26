import { IDictionary } from "common-types";
/**
 * Determines the appropriate `region` to point at for the **sls** command.
 * This is based on config, CLI options, and the Serverless configuration.
 *
 * @param opts the CLI options which were used
 */
export declare function getRegion(opts: IDictionary): Promise<any>;

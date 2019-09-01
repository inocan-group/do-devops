import { IDetermineOptions } from "../../@types";
/**
 * Uses various methods to determine which _stage_
 * the serverless function should be deployed to.
 * If the stage can not be determined than the user
 * will be asked interactively.
 *
 * @param opts the CLI options hash (which includes stage as
 * a possible parameter)
 */
export declare function determineStage(opts: IDetermineOptions): Promise<any>;

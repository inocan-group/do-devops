import { IBuildTool } from "../../@types";
/**
 * Asks for the primary build tool the user wants to use
 * for the repo. It will also return the value for further
 * processing.
 */
export declare function askBuildTool(isServerless: boolean): Promise<IBuildTool>;

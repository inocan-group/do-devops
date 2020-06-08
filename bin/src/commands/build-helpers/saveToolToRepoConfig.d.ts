import { IBuildTool } from "../../@types/defaultConfig";
/**
 * Saves a given _build tool_ as the default for the current
 * repo.
 */
export declare function saveToolToRepoConfig(tool: IBuildTool): Promise<void>;

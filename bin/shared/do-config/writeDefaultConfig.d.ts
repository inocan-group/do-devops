import { IDictionary } from "common-types";
import { IDoConfig } from "../../@types";
/**
 * **writeConfig**
 *
 * Writes the `do-devops` config file to either the **project**'s root
 * or User's **home directory**.
 */
export declare function writeConfig(c: IDoConfig, projectOrUserConfig?: "user" | "project"): void;
/**
 * Writes a sub-command's _section_ of the configuration.
 *
 * @param section The section to be updated
 * @param content The content to update with; if blank the default will be used
 * @param projectOrUserConfig States whether **user** or **project** config;
 * default is **project**
 */
export declare function writeSection(section: keyof IDoConfig, content?: IDictionary, projectOrUserConfig?: "project" | "user"): Promise<void>;
/**
 * Writes a `do.config.js` file using the default properties
 * setup in this repo.
 */
export declare function writeDefaultConfig(): void;

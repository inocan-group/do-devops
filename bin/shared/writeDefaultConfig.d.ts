import { IDoConfig } from "../commands/defaults";
import { IDoConfigSections } from "./config";
import { IDictionary } from "common-types";
/**
 * **writeConfig**
 *
 * Writes the `do-devops` config file
 */
export declare function writeConfig(c: IDoConfig): void;
export declare function writeSection(section: IDoConfigSections, content?: IDictionary): Promise<void>;
export declare function writeWholeFile(): void;

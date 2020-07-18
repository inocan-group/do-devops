import { writeFileSync } from "fs";
import { getDefaultConfig, getFullDefaultConfig } from "./getDefaultConfig";
import { IDictionary } from "common-types";
import { writeConfig, getConfig } from "./index";
import { IDoConfig } from "../../@types";

/**
 * Writes a sub-command's _section_ of the configuration.
 *
 * @param section The section to be updated
 * @param content The content to update with; if blank the default will be used
 * @param projectOrUserConfig States whether **user** or **project** config;
 * default is **project**
 */
export async function writeSection(
  section: keyof IDoConfig,
  content?: IDictionary,
  projectOrUserConfig?: "project" | "user"
) {
  projectOrUserConfig = projectOrUserConfig ? projectOrUserConfig : "project";
  const sectionMeta = content ? content : getDefaultConfig(section);
  const currentConfig = await getConfig(projectOrUserConfig);
  // TODO: this should not be needed
  delete (currentConfig as any).default;

  const output = { ...currentConfig, [section]: sectionMeta };
  writeConfig(output, projectOrUserConfig);
}

/**
 * Writes a `do.config.js` file using the default properties
 * setup in this repo.
 */
export function writeDefaultConfig() {
  writeConfig(getFullDefaultConfig());
}

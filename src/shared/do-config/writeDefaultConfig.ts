import { writeFileSync } from "fs";
import {
  IDoConfigSections,
  getDefaultConfig,
  getFullDefaultConfig
} from "./getDefaultConfig";
import { IDictionary } from "common-types";
import { getConfigFilename, getConfig } from "./index";
import { IDoConfig } from "../../@types";

/**
 * **writeConfig**
 *
 * Writes the `do-devops` config file to either the **project**'s root
 * or User's **home directory**.
 */
export function writeConfig(
  c: IDoConfig,
  projectOrUserConfig: "user" | "project" = "project"
) {
  const filename = getConfigFilename(projectOrUserConfig);
  writeFileSync(
    filename,
    "const config = " +
      JSON.stringify(c, null, 2) +
      ";\nmodule.exports = config;",
    {
      encoding: "utf-8"
    }
  );
}

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
  const currentConfig = await getConfig({ projectOrUserConfig });
  writeConfig({ ...currentConfig, [section]: sectionMeta });
}

/**
 * Writes a `do.config.js` file using the default properties
 * setup in this repo.
 */
export function writeDefaultConfig() {
  writeConfig(getFullDefaultConfig());
}

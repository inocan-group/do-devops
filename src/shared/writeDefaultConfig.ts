import * as defaults from "../commands/defaults";
import chalk from "chalk";
import { readFileSync, writeFileSync } from "fs";
import { root, IDoConfig } from "../commands/defaults";
import {
  getDefaultConfig,
  getDefaultForConfigSection,
  IDoConfigSections,
  getConfigFilename,
  getCurrentConfig,
  getConfig
} from "./config";
import { IDictionary } from "common-types";

/**
 * **writeConfig**
 *
 * Writes the `do-devops` config file
 */
export function writeConfig(c: IDoConfig) {
  const filename = getConfigFilename();
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

export async function writeSection(
  section: IDoConfigSections,
  content?: IDictionary
) {
  const sectionMeta = content ? content : getDefaultForConfigSection(section);
  const currentConfig = await getConfig();
  writeConfig({ ...currentConfig, [section]: sectionMeta });
}

export function writeWholeFile() {
  writeConfig(getDefaultConfig());
}

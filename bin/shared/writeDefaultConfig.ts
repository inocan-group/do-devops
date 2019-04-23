import * as defaults from "../commands/defaults";
import chalk from "chalk";
import { readFileSync, writeFileSync } from "fs";
import { root, IDoConfig } from "../commands/defaults";
import {
  getDefaultConfig,
  getDefaultForConfigSection,
  IDoConfigSections,
  getConfigFilename,
  getCurrentConfig
} from "./config";

export function writeConfig(c: IDoConfig) {
  const filename = getConfigFilename();
  writeFileSync(
    filename,
    "import IDoConfig from 'devops';\nexport default " +
      JSON.stringify(c, null, 2) +
      " as IDoConfig\n",
    {
      encoding: "utf-8"
    }
  );
}

export function writeSection(section: IDoConfigSections) {
  const sectionMeta = getDefaultForConfigSection(section);
  const currentConfig = getCurrentConfig();
  writeConfig({ ...currentConfig, [section]: sectionMeta });
}

export function writeWholeFile() {
  writeConfig(getDefaultConfig());
}

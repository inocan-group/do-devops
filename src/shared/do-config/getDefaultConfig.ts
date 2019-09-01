import * as defaults from "../../commands/config";
import { DevopsError } from "../index";
import { defaultConfigSections } from "../defaultConfigSections";
import { IDoConfig } from "../../@types";

export type IDoConfigSections = keyof typeof defaults;

/**
 * **getDefaultConfig**
 *
 * If the `command` is not specified it returns the default config file
 * with **all** sections filled in. If you want only a only a single
 * section then you can name it (where "global" is what it says on
 * the tin).
 */
export function getDefaultConfig(command?: keyof IDoConfig) {
  if (!command) {
    const sections = defaultConfigSections();
    let content: IDoConfig;
    sections.forEach((section: keyof IDoConfig) => {
      const newContent = getDefaultConfig(section);
      content = { ...content, ...newContent };
    });

    return content;
  }
  if (!defaults[command as keyof typeof defaults]) {
    throw new DevopsError(
      `Attempt to get the defaults for the "${command}" command failed because there is no file defining it!`,
      "devops/not-ready"
    );
  }

  if (typeof defaults[command as keyof typeof defaults] !== "function") {
    throw new DevopsError(
      `Attempt to get the defaults for the "${command}" command failed because while there IS a file defining it it does not have a default export which is a function!`,
      "devops/not-allowed"
    );
  }
  return defaults[command as keyof typeof defaults]();
}

export function getFullDefaultConfig() {
  return getDefaultConfig() as IDoConfig;
}

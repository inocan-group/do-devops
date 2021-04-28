import * as config from "../../config/index";
import { IDoConfig } from "~/@types";
import { DevopsError } from "~/errors";
import { defaultConfigSections } from "./defaultConfigSections";

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

    let content: IDoConfig | undefined;
    for (const section of sections) {
      const newContent = { [section]: getDefaultConfig(section as keyof IDoConfig) };
      if (newContent) {
        content = (content ? { ...content, ...newContent } : newContent) as IDoConfig;
      }
    }

    return content;
  }
  if (!config[command as keyof typeof config]) {
    throw new DevopsError(
      `Attempt to get the defaults for the "${command}" command failed because there is no file defining it!`,
      "devops/not-ready"
    );
  }

  if (typeof config[command as keyof typeof config] !== "function") {
    throw new DevopsError(
      `Attempt to get the defaults for the "${command}" command failed because while there IS a file defining it it does not have a default export which is a function!`,
      "devops/not-allowed"
    );
  }
  return config[command as keyof typeof config]();
}

export function getFullDefaultConfig() {
  return getDefaultConfig() as IDoConfig;
}

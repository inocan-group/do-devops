import { IDictionary } from "common-types";
import { getConfig } from "../shared";
import { IDoConfig } from "../@types";

/**
 * The base class for commands which have a configuration
 * component. This class defines the contract for creating
 * default values as well as providing some helper methods
 * for subclasses to leverage.
 */
export abstract class BaseDefault<T> {
  /** the _command_ which this class is responsible for */
  abstract readonly command: keyof IDoConfig;

  /**
   * returns a dictionary of default values for the _config_ of a given command
   */
  abstract defaultValues(): T;
  /**
   * Asks the user for the correct values. The _default value_ will be selected by
   * default but user can decide to move away from that.
   */
  abstract askForValues(): Promise<T>;

  /**
   * **findMissingConfigProperties**
   *
   * Validates that the configuration information from the file has all the properties that are
   * defined as defaultValues. The result is a list of properties which have a _default value_
   * but are missing from the current config file. This
   *
   * @param currentConfig the configuration for the specific command (from the config file)
   */
  async findMissingConfig() {
    const currentConfig = (await getConfig())[this.command];
    const defaultValueKeys = Object.keys(this.defaultValues()) as Array<
      keyof T
    >;
    const configFileKeys = Object.keys(currentConfig) as string[];

    return defaultValueKeys.reduce((acc: Array<keyof T>, curr: keyof T) => {
      if (!configFileKeys.includes(curr as string)) {
        acc.push(curr);
      }
      return acc;
    }, []);
  }

  /**
   * **fixMissingConfig**
   *
   * Finds and _adds_ all properties that are **not** in the current configuration file
   */
  async fixMissingConfig() {
    const currentConfig = (await getConfig())[this.command];
    const missing: Array<keyof T> = await this.findMissingConfig();
    const defaultValues = this.defaultValues();
    const fixed = {
      ...missing.reduce(
        (acc: T, curr) => {
          acc[curr] = defaultValues[curr as keyof T];
          return acc;
        },
        {} as IDictionary
      ),
      ...currentConfig
    };
  }
}

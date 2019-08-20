import * as defaults from "../commands/defaults";
import { IDoConfig } from "../commands/defaults";
export declare type IDoConfigSections = keyof typeof defaults;
/**
 * **getConfigFilename**
 *
 * returns the path to the configuration filename
 */
export declare function getConfigFilename(): string;
/**
 * **getCurrentConfig**
 *
 * returns the current configuration as a `IDoConfig` object
 */
export declare function getCurrentConfig(): defaults.IDoConfig;
/**
 * **getConfigSectionNames**
 *
 * returns a list of configuration section names; this includes
 * the `global` section.
 */
export declare function getConfigSectionNames(): string[];
/**
 * **getDefaultForConfigSection**
 *
 * returns the default config for a given section
 */
export declare function getDefaultForConfigSection(section: IDoConfigSections): {};
export declare function askUserForConfigDefaults(section: IDoConfigSections): Promise<void>;
/**
 * **getDefaultConfig**
 *
 * Returns the full _default_ configuration; use `getConfigSection()` if you
 * only want a particular section.
 */
export declare function getDefaultConfig(): defaults.IDoConfig;
/**
 * **getConfig**
 *
 * Gets the current configuration based on the `do.config.js` file.
 * This will include global as well as command-specific configuration.
 *
 * The _command-specific_ config should be stored off the root of
 * the configuration with the same name as the command. The _global_
 * config is stored off the root config on the property of `global`.
 * This allows for consumers of this function to isolate like so:
 *
```typescript
const { global, myCommand } = await getConfig();
```
 */
export declare function getConfig(): Promise<IDoConfig>;

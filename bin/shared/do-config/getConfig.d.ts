import { IDoConfig } from "../../@types";
export interface IGetConfigOptions {
    projectOrUserConfig: "user" | "project";
    exitIfNotFound: boolean;
}
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
 *
 * Note: if you opt to exit on the config file not being found you will
 * get a sensible message to the console and the process will exit.
 *
 * If you decide _not_ to exit then it return the configuration if found
 * but otherwise return `undefined`.
 */
export declare function getConfig(callerOptions?: Partial<IGetConfigOptions>): Promise<IDoConfig>;

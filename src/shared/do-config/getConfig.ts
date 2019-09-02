import chalk from "chalk";
import { existsSync } from "fs";
import { getConfigFilename, writeDefaultConfig } from "./index";
import { IDoConfig } from "../../@types";

export interface IGetConfigOptions {
  projectOrUserConfig: "user" | "project";
  exitIfNotFound: boolean;
}

const cache: {
  user: IDoConfig;
  project: IDoConfig;
} = {
  user: undefined,
  project: undefined
};

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
export async function getConfig(
  callerOptions: Partial<IGetConfigOptions> = {}
): Promise<IDoConfig> {
  const options: IGetConfigOptions = {
    ...{
      projectOrUserConfig: "project",
      exitIfNotFound: true
    },
    ...callerOptions
  };
  const filename = getConfigFilename(options.projectOrUserConfig);
  let config: IDoConfig;

  if (!existsSync(filename) && options.projectOrUserConfig === "project") {
    console.log(
      `- configuration file not found [ %s ]`,
      chalk.grey(process.env.PWD)
    );
    writeDefaultConfig();
    console.log(
      `- default configuration was written to "%s" in project root`,
      chalk.bold.italic("do.config.js")
    );
  }

  try {
    config = await import(filename);
    return config;
  } catch (e) {
    if (options.exitIfNotFound) {
      console.log(
        "- \ud83d\udca9  Problem importing the config file [ %s ]: %s",
        filename,
        chalk.grey(e.message)
      );
      console.log(
        "- Either edit the file to the correct %s or delete the config and it will be recreated with the default values\n",
        chalk.italic("typing")
      );
      process.exit();
    }
    return;
  }
}

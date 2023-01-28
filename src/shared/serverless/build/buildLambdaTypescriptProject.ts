import chalk from "chalk";
import * as os from "node:os";

import { IDictionary, IServerlessAccountInfo, IServerlessYaml } from "common-types";
import { asyncExec, rm } from "async-shelljs";
import {
  createFunctionEnum,
  createInlineExports,
  createWebpackEntryDictionaries,
  getLocalHandlerInfo,
  getServerlessBuildConfiguration,
  saveToServerlessYaml,
} from "src/shared/serverless";

import { IDoBuildConfig } from "src/@types";
import { getYeomanScaffolds } from "src/shared/yeoman";
import { filesExist, saveYamlFile } from "src/shared/file";
import { emoji } from "src/shared/ui";

const ACCOUNT_INFO_YAML = "./serverless-config/account-info.yml";

/**
 * Builds a `serverless.yml` file from the configuration
 * available in the `/serverless-config` directory.
 *
 * The key requirement here is that the `accountInfo` hash is
 * built out. This information will be gathered from the
 * following sources (in this order):
 *
 * 1. look within the `serverless.yml` for info (if it exists)
 * 2. ask the user for the information (saving values as default for next time)
 */
export async function buildLambdaTypescriptProject(
  opts: IDictionary = {},
  _config: IDoBuildConfig = {},
  /** modern scaffolding will pass in the config function to be managed here in this process */
  configFn?: (c: IServerlessAccountInfo) => IServerlessYaml
) {
  const modern = getYeomanScaffolds().includes("generator-lambda-typescript");
  const accountInfo = await getServerlessBuildConfiguration();
  const hasWebpackPlugin = accountInfo?.devDependencies?.includes("serverless-webpack");
  // const buildSystem = config.buildTool;

  // force transpilation
  if (opts.force) {
    // await serverlessTranspilation({ argv, opts, config, tooling, serverless });
  }

  if (!modern) {
    // temporarily lay down a config file
    saveYamlFile(ACCOUNT_INFO_YAML, accountInfo);
  }

  console.log(
    `- The account info for ${chalk.bold`${accountInfo.name} [`} ${chalk.dim(accountInfo.accountId)} ${chalk.bold`]`} has been gathered`
  );

  const handlerInfo = await getLocalHandlerInfo();
  console.log(
    chalk.gray`- handler functions [ ${chalk.bold(String(handlerInfo.length))} ] have been identified`
  );

  await createInlineExports(handlerInfo);
  console.log(
    chalk.gray`- The inline function configuration file [ ${chalk.bold.italic`serverless-config/functions/inline.ts`} ] has been configured`
  );

  await createFunctionEnum(handlerInfo);
  console.log(
    chalk.gray`- The enumeration and type [ ${chalk.bold.italic`src/@types/functions.ts`} ] for the available functions has been configured `
  );

  if (hasWebpackPlugin) {
    const exist = filesExist("webpack.js-entry-points.json", "webpack.js-entry-points.json");
    if (exist) {
      rm(...exist);
      console.log(
        `- ${emoji.eyeballs} removed webpack entry point files so as not to confuse with what the ${chalk.italic`serverless-webpack`} plugin is doing}`
      );
    }
  } else {
    // the preferred means of bundling using webpack
    await createWebpackEntryDictionaries(handlerInfo.map((i) => i.source));
    console.log(
      chalk.gray`- added webpack ${chalk.italic`entry files`} to facilitate code build and watch operations`
    );
  }

  if (modern && configFn) {
    const serverless = configFn(accountInfo);
    await saveToServerlessYaml(serverless);
  } else {
    console.log(
      `- handing off the build of the ${chalk.green.bold`serverless.yml`} to the repo's ${chalk.bold`build`} script\n`
    );

    await asyncExec("yarn ts-node serverless-config/build.ts --color=always", {
      env: {
        ...process.env,
        TERM: "xterm-color",
        ...(os.platform().includes("win") ? {} : { shell: "/bin/bash" }),
      },
    });
    rm(ACCOUNT_INFO_YAML);
    console.log(chalk.gray`- removed the temporary ${chalk.blue`account-info.yml`} file from the repo`);
  }

  console.log(
    chalk.green`- ${chalk.bold`serverless.yml`} has been updated successfully ${emoji.rocket}\n`
  );
}

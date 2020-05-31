import * as chalk from "chalk";
import * as os from "os";

import { askForAccountInfo, getAccountInfoFromServerlessYaml } from "../index";
import { asyncExec, rm } from "async-shelljs";
import { filesExist, saveYamlFile } from "../../file";

import { IDictionary } from "common-types";
import { IDoBuildConfig } from "../../../@types";
import { createFunctionEnum } from "./createFunctionEnum";
import { createInlineExports } from "./index";
import { createWebpackEntryDictionaries } from "./createWebpackEntryDictionaries";
import { emoji } from "../../ui";
import { getLocalHandlerInfo } from "../getLocalHandlerInfo";
import { getPackageJson } from "../../npm";
import { getValidServerlessHandlers } from "../../ast/index";
import { rmdirSync } from "fs";
import { saveToServerlessYaml } from "../saveToServerlessYaml";

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
export async function buildServerlessMicroserviceProject(opts: IDictionary = {}, config: IDoBuildConfig = {}) {
  let stage = "starting";
  const devDependencies = Object.keys(getPackageJson().devDependencies);
  const knownAccountInfo = {
    // TODO: add file storage for the askForAccountInfo
    ...{},
    ...(await getAccountInfoFromServerlessYaml()),
    devDependencies,
  };

  const accountInfo = await askForAccountInfo(knownAccountInfo);
  saveYamlFile(ACCOUNT_INFO_YAML, accountInfo);
  const hasWebpackPlugin = devDependencies.includes("serverless-webpack");

  console.log(
    chalk`- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered`
  );

  const handlerInfo = getLocalHandlerInfo();
  console.log(chalk`{grey - handler functions [ {bold ${String(handlerInfo.length)}} ] have been identified}`);

  await createInlineExports(handlerInfo);
  console.log(
    chalk`{grey - The inline function configuration file [ {bold {italic serverless-config/functions/inline.ts}} ] has been configured}`
  );

  await createFunctionEnum(handlerInfo);
  console.log(
    chalk`{grey - The enumeration and type [ {bold {italic src/@types/functions.ts}} ] for the available functions has been configured }`
  );

  if (!hasWebpackPlugin) {
    await createWebpackEntryDictionaries(handlerInfo.map((i) => i.source));
    console.log(chalk`{grey - added webpack {italic entry files} to facilitate code build and watch operations}`);
  } else {
    const exist = filesExist("webpack.js-entry-points.json", "webpack.js-entry-points.json");
    if (exist) {
      rm(...exist);
      console.log(
        chalk`- ${emoji.eyeballs} removed webpack entry point files so as not to confuse with what the {italic serverless-webpack} plugin is doing}`
      );
    }
  }

  console.log(chalk`- handing off the build of the {green {bold serverless.yml}} to the repo's {bold build} script\n`);

  await asyncExec(`yarn ts-node serverless-config/build.ts --color=always`, {
    env: {
      ...process.env,
      TERM: "xterm-color",
      ...(os.platform().includes("win") ? {} : { shell: "/bin/bash" }),
    },
  });

  rm(ACCOUNT_INFO_YAML);
  console.log(chalk`{grey - removed the temporary {blue account-info.yml} file from the repo}`);

  console.log(chalk`{green - {bold serverless.yml} has been updated successfully ${emoji.rocket}}\n`);
}

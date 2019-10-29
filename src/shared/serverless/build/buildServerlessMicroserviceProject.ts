import { getAccountInfoFromServerlessYaml, askForAccountInfo } from "../index";
import { createInlineExports } from "./index";
import chalk from "chalk";
import { getValidServerlessHandlers } from "../../ast/index";
import { createFunctionEnum } from "./createFunctionEnum";
import { asyncExec, rm } from "async-shelljs";
import { saveToServerlessYaml } from "../saveToServerlessYaml";
import { saveYamlFile, filesExist } from "../../file";
import { emoji } from "../../ui";
import * as os from "os";
import { createWebpackEntryDictionaries } from "./createWebpackEntryDictionaries";
import { getPackageJson } from "../../npm";
import { IDoBuildConfig } from "../../../@types";
import { IDictionary } from "common-types";
import { getLocalHandlerInfo } from "../getLocalHandlerInfo";

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
export async function buildServerlessMicroserviceProject(
  opts: IDictionary = {},
  config: IDoBuildConfig = {}
) {
  let stage = "starting";
  const knownAccountInfo = {
    // TODO: add file storage for the askForAccountInfo
    ...{},
    ...(await getAccountInfoFromServerlessYaml())
  };

  const accountInfo = await askForAccountInfo(knownAccountInfo);
  saveYamlFile("serverless-config/account-info.yml", accountInfo);
  const hasWebpackPlugin = Object.keys(
    getPackageJson().devDependencies
  ).includes("serverless-webpack");

  console.log(
    chalk`- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered`
  );

  const handlerInfo = getLocalHandlerInfo();
  console.log(
    chalk`{grey - handler functions [ {bold ${String(
      handlerInfo.length
    )}} ] have been identified}`
  );

  await createInlineExports(handlerInfo);
  console.log(
    chalk`{grey - The inline function configuration file [ {bold {italic serverless-config/functions/inline.ts}} ] has been configured}`
  );

  await createFunctionEnum(handlerInfo);
  console.log(
    chalk`{grey - The enumeration and type [ {bold {italic src/@types/functions.ts}} ] for the available functions has been configured }`
  );

  if (!hasWebpackPlugin) {
    await createWebpackEntryDictionaries(handlerInfo.map(i => i.source));
    console.log(
      chalk`{grey - added webpack {italic entry files} to facilitate code build and watch operations}`
    );
  } else {
    const exist = await filesExist(
      "webpack.js-entry-points.json",
      "webpack.js-entry-points.json"
    );
    if (exist) {
      rm(...exist);
      console.log(
        chalk`- ${emoji.eyeballs} removed webpack entry point files so as not to confuse with what the {italic serverless-webpack} plugin is doing}`
      );
    }
  }

  console.log(
    chalk`- handing off the build of the {green {bold serverless.yml}} to the repo's {bold build} script\n`
  );

  await asyncExec(`yarn ts-node serverless-config/build.ts --color=always`, {
    env: {
      ...process.env,
      TERM: "xterm-color",
      ...(os.platform().includes("win") ? {} : { shell: "/bin/bash" })
    }
  });

  console.log(
    chalk`{green - {bold serverless.yml} has been updated successfully ${emoji.rocket}}\n`
  );
}

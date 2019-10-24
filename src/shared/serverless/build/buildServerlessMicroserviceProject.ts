import { getAccountInfoFromServerlessYaml, askForAccountInfo } from "../index";
import { createInlineExports } from "./index";
import chalk from "chalk";
import { getValidServerlessHandlers } from "../../ast/index";
import { createFunctionEnum } from "./createFunctionEnum";
import { asyncExec } from "async-shelljs";
import { saveToServerlessYaml } from "../saveToServerlessYaml";
import { saveYamlFile } from "../../file";
import { emoji } from "../../ui";
import * as os from "os";

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
export async function buildServerlessMicroserviceProject() {
  let stage = "starting";
  const knownAccountInfo = {
    // TODO: add file storage for the askForAccountInfo
    ...{},
    ...(await getAccountInfoFromServerlessYaml())
  };

  const accountInfo = await askForAccountInfo(knownAccountInfo);
  saveYamlFile("serverless-config/account-info.yml", accountInfo);

  console.log(chalk`{bold {yellow - Starting SERVERLESS build process}}`);

  console.log(
    chalk`- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered`
  );

  const inlineFiles = getValidServerlessHandlers();
  console.log(
    chalk`{grey - handler functions [ {bold ${String(
      inlineFiles.length
    )}} ] have been identified}`
  );

  await createInlineExports(inlineFiles);
  console.log(
    chalk`{grey - The inline function configuration file [ {bold {italic serverless-config/functions/inline.ts}} ] has been configured}`
  );

  await createFunctionEnum(inlineFiles);
  console.log(
    chalk`{grey - The enumeration and type [ {bold {italic src/@types/functions.ts}} ] for the available functions has been configured }`
  );

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
    chalk`{green - {bold serverless.yml} has been updated successfully ${emoji.rocket}}`
  );
}

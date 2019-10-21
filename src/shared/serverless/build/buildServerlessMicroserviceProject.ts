import { getAccountInfoFromServerlessYaml, askForAccountInfo } from "..";
import chalk from "chalk";
import path from "path";
import { parseFile, getValidServerlessHandlers } from "../../ast/index";
import { existsSync } from "fs";

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

  console.log(
    chalk`- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered; ready to build {green serverless.yml}`
  );

  // try {
  //   // const config = (await getMicroserviceConfig(accountInfo)).replace(
  //   //   /^.*\}\'(.*)/,
  //   //   "$1"
  //   // );

  //   stage = "config-returned";
  //   let configComplete: IServerlessConfig;

  //   try {
  const inlineFiles = getValidServerlessHandlers();
  await createInlineExports(inlineFiles);
  await createInlineEnumeration(inlineFiles);
  await callRepoServerlessBuild();

  // const configFile = path.join(process.env.PWD, "/serverless-config/config.ts");
  // console.log(configFile);
  // const exists = existsSync(configFile);
  // console.log("exists", exists);
  // const config = (await import(configFile)).default;
  // console.log(config);

  // const ast = parseFile(
  //   "/Volumes/Coding/universal/transport-services/serverless-config/config.ts"
  // );

  //     console.log("made it");

  //     // const config = (await import(configFile)).default(accountInfo);
  //     process.exit();
  //   } catch (e1) {
  //     console.log(
  //       chalk`- {yellow Warning:} parsing the configuration caused an error ${emoji.shocked}`
  //     );
  //     console.log(
  //       chalk`{dim - will make second attempt with more aggressive regex}`
  //     );

  //     const strippedOut = config.replace(/(.*)\{"service.*/, "$1");
  //     const newAttempt = config
  //       .replace(/\n/g, "")
  //       .replace(/.*(\{"service.*)/, "$1");
  //     try {
  //       configComplete = JSON.parse(newAttempt);
  //       console.log(
  //         chalk`- by removing some of the text at the beginning we {bold were} able to parse the config ${emoji.thumbsUp}`
  //       );
  //       console.log(chalk`- the text removed was:\n{dim ${strippedOut}}`);
  //     } catch (e) {
  //       console.log(
  //         chalk`{red - Failed {italic again} to parse the configuration file!}`
  //       );
  //       console.log(`- Error message was: ${e.message}`);
  //       console.log(
  //         chalk`- The config that is being parsed is:\n\n${newAttempt}\n`
  //       );
  //       process.exit();
  //     }
  //   }
  //   stage = "config-parsed";

  //   await saveFunctionsTypeDefinition(configComplete);
  //   console.log(
  //     chalk`- The function enumeration at {bold src/@types/build.ts} has been updated`
  //   );
  //   stage = "type-definitions-written";
  //   const fns = Object.keys(configComplete.functions);
  //   const plugins = configComplete.plugins || [];
  //   console.log(
  //     chalk`- The serverless config consists of:\n  - {yellow ${String(
  //       fns.length
  //     )}} functions [ {dim ${truncate(fns, 5)}} ]\n  - {yellow ${String(
  //       configComplete.stepFunctions
  //         ? configComplete.stepFunctions.stateMachines.length
  //         : 0
  //     )}} step functions\n  - {yellow ${String(
  //       plugins.length
  //     )}} plugins [ {dim ${truncate(plugins, 5)}} ]`
  //   );
  //   if (configComplete.layers) {
  //     const layers = Object.keys(configComplete.layers);
  //     console.log(
  //       chalk`  - {yellow ${String(layers.length)}} layers [ {dim ${truncate(
  //         layers,
  //         5
  //       )}} ]`
  //     );
  //   }

  //   configComplete = await askAboutLogForwarding(configComplete);

  //   await saveToServerlessYaml(configComplete);
  //   console.log(
  //     chalk`- The {green {bold serverless.yml}} file has been updated! ${emoji.rocket}\n`
  //   );

  //   return configComplete;
  // } catch (e) {
  //   console.log(
  //     chalk`- {red the attempt to parse the serverless config has failed at stage "${stage}"!} ${emoji.poop}`
  //   );
  //   console.log(
  //     `- The config sent in was:\n${JSON.stringify(accountInfo, null, 2)}`
  //   );

  //   console.log("- " + e.message);
  //   console.log(chalk`{dim ${e.stack}}`);
  //   console.log();

  //   process.exit();
  // }
}

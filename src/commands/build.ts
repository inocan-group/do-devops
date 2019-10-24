import {
  buildServerlessMicroserviceProject,
  emoji,
  getConfig,
  isServerless,
  getPackageJson
} from "../shared";
import chalk from "chalk";
import { IDictionary } from "common-types";
import { BuildTool } from "../@types";
import { saveToolToRepoConfig, askBuildTool } from "./build-helpers/index";

export const defaultConfig = {
  preBuildHooks: ["clean"],
  targetDirectory: "dist",
  buildTool: "tsc"
};

export function description() {
  return `Efficient and clear build pipelines for serverless and/or NPM libraries`;
}

export async function handler(opts: IDictionary) {
  const { build: config } = await getConfig();
  const serverlessProject = await isServerless();
  const buildTool: BuildTool =
    opts.buildTool ||
    config.buildTool ||
    (await askBuildTool(serverlessProject ? true : false));
  const hasWebpackPlugin = Object.keys(
    getPackageJson().devDependencies
  ).includes("serverless-webpack");

  await saveToolToRepoConfig(buildTool);

  if (serverlessProject) {
    await buildServerlessMicroserviceProject();

    if (config.buildTool === "webpack") {
      if (opts.force) {
        const buildTool = await import(
          `./build-helpers/tools/${config.buildTool}`
        );
      } else {
        if (hasWebpackPlugin) {
          console.log(
            chalk`{grey - {bold Note:} you're configured to use {bold Webpack} as your code build tool and have the {italic serverless-webpack} plugin so use of Webpack will happen at deploy time. }`
          );
        } else {
          console.log(chalk`{grey - {bold Note:} you're configured to use {bold Webpack} as your code build tool and do not appear to be
  using the {italic serverless-webpack} plugin. This is entirely fine but code will not be
  transpiled with the {italic build} command unless you include the {blue --force} switch.}`);
          console.log(chalk`\n{grey - {bold Note:} for most people using this config, {blue yarn do watch} will be the most efficient way
  to ensure that you always have transpiled code when you {italic deploy}. If you do not then 
  the {italic deploy} command will detect this and transpile at deploy-time.}`);
        }
      }
    }
  } else {
    if (config.buildTool) {
      if (hasWebpackPlugin) {
        console.log(
          chalk`- You are configured to use the {bold ${config.buildTool}} but you {italic also} have the {italic serverless-webpack} plugin. This is probably a mistake! ${emoji.shocked}`
        );
      }
      const buildTool = await import(
        `./build-helpers/tools/${config.buildTool}`
      );
      await buildTool.build(config, opts);
    } else {
      throw new Error("There was no build tool configured for this repo!");
    }
  }

  console.log(chalk`\n- {bold build} complete ${emoji.party}\n`);
}

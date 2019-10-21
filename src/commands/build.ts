import {
  buildServerlessMicroserviceProject,
  emoji,
  getConfig,
  isServerless
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

  await saveToolToRepoConfig(buildTool);

  if (serverlessProject) {
    await buildServerlessMicroserviceProject();
  }

  console.log(
    chalk`- building the {bold {green serverless.yml}} file ${emoji.party}`
  );

  await buildServerlessMicroserviceProject();
}

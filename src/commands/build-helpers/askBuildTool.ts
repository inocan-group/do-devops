import chalk from "chalk";
import inquirer from "inquirer";

import { BuildTool, IBuildTool } from "~/@types";
import { getPackageJson } from "~/shared/npm";
import { saveToolToRepoConfig } from "./index";

/**
 * Asks for the primary build tool the user wants to use
 * for the repo. It will also return the value for further
 * processing.
 */
export async function askBuildTool(isServerless: boolean): Promise<IBuildTool> {
  const packages = Object.keys(getPackageJson().devDependencies || {});

  const findLikely = (exclude: IBuildTool | null = null) =>
    packages.some((i) => i === "bili" && i !== exclude)
      ? "bili"
      : packages.some((i) => i === "rollup" && i !== exclude)
      ? "rollup"
      : packages.some((i) => i === "webpack" && i !== exclude)
      ? "webpack"
      : packages.some((i) => i === "typescript" && i !== exclude)
      ? "typescript"
      : undefined;

  const mostLikely = findLikely();
  const alternative = findLikely(mostLikely);

  const ifTypescriptMessage = chalk`{reset
    
  {bold {white Note:}} since this is a {bold {blue Serverless}} project you may consider 
  using "none" to only build the {italic serverless.yml} file at build time. Alternatively,
  if you choose "webpack" it will allow you will be able to build both by adding the {blue 
  --force} parameter.

  }`;

  const message = chalk`Choose a build tool for this repo [ {grey {italic suggestion: }${
    mostLikely
      ? [mostLikely, alternative].filter((i) => i).join(", ")
      : "[ {grey no suggestions"
  }} ]${isServerless ? ifTypescriptMessage : ""}`;
  const choices = Object.keys(BuildTool);

  const baseProfileQuestion: inquirer.ListQuestion = {
    type: "list",
    name: "buildTool",
    message,
    choices,
    default: mostLikely || choices[0],
  };

  const answer = await inquirer.prompt(baseProfileQuestion);

  await saveToolToRepoConfig(answer.buildTool);

  return answer.buildTool as IBuildTool;
}

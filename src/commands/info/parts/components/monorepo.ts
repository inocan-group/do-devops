import chalk from "chalk";
import { Observations } from "~/@types";

export function monorepoInfo(o: Observations): [string, string] {
  if (o.has("monorepo")) {
    const type = o.has("pnpmWorkspaces")
      ? chalk`{bold {yellow pnpm} workspaces}`
      : o.has("yarnWorkspaces")
        ? chalk`{bold {yellow yarn}} workspaces}`
        : o.has("lerna")
          ? chalk`{bold {yellow lerna}}`
          : o.has("rushjs")
            ? chalk`{bold {yellow Rush}}`
            : chalk`{bold {red unknown}}`;


    return ["Monorepo", chalk`This repo is a {bold {green monorepo}} managed by ${type}`];
  }

  return ["", ""];
}
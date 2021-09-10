import chalk from "chalk";
import { Observations } from "~/@types";
import { getLernaPackages } from "~/shared/monorepo/getLernaPackages";

export async function monorepoInfo(o: Observations): Promise<[string, string]> {
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

    const list = o.has("lerna")
      ? `. Packages are:\n\n${(await getLernaPackages()).map((p) => `- ${p.name}`).join("\n")}`
      : "";

    return ["Monorepo", chalk`This repo is a {bold {green monorepo}} managed by ${type}${list}`];
  }

  return ["", ""];
}

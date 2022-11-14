import chalk from "chalk";
import { Observations } from "src/@types";
import { getLernaPackages } from "src/shared/monorepo/getLernaPackages";

export async function monorepoInfo(o: Observations): Promise<[string, string]> {
  if (o.has("monorepo")) {
    const type = o.has("pnpmWorkspaces")
      ? `{bold {yellow pnpm} workspaces}`
      : o.has("yarnWorkspaces")
      ? `{bold {yellow yarn}} workspaces}`
      : o.has("lerna")
      ? `{bold {yellow lerna}}`
      : o.has("rushjs")
      ? `{bold {yellow Rush}}`
      : `{bold {red unknown}}`;

    const list = o.has("lerna")
      ? `. Packages are:\n\n${(await getLernaPackages()).map((p) => `- ${p.name}`).join("\n")}`
      : "";

    return ["Monorepo", `This repo is a {bold {green monorepo}} managed by ${type}${list}`];
  }

  return ["", ""];
}

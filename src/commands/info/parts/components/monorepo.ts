/* eslint-disable unicorn/no-await-expression-member */
import chalk from "chalk";
import { Observations } from "src/@types";
import { getLernaPackages } from "src/shared/monorepo/getLernaPackages";

export async function monorepoInfo(o: Observations): Promise<[string, string]> {
  if (o.has("monorepo")) {
    const type = o.has("pnpmWorkspaces")
      ? `${chalk.bold.yellow`pnpm`} workspaces`
      : o.has("yarnWorkspaces")
      ? `${chalk.bold.yellow`yarn`} workspaces`
      : o.has("lerna")
      ? `${chalk.bold.yellow`lerna`} workspaces`
      : o.has("rushjs")
      ? `${chalk.bold.yellow`Rust`}`
      : chalk.bold.red`unknown`;

    const list = o.has("lerna")
      ? `. Packages are:\n\n${(await getLernaPackages()).map((p) => `- ${p.name}`).join("\n")}`
      : "";

    return ["Monorepo", `This repo is a ${chalk.bold.green`monorepo`} managed by ${type}${list}`];
  }

  return ["", ""];
}

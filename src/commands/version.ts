import chalk from "chalk";
import { getConfig, getPackageJson } from "../shared";
import { asyncExec } from "async-shelljs";
import { IDictionary } from "common-types";
import { table } from "table";

/**
 * Gets the `git` and `npm` version of a file as well as
 * whether the local copy is dirty.
 */
export async function handler() {
  // const config = await getConfig();
  const info: IDictionary = JSON.parse(
    await asyncExec("yarn info --json", { silent: true })
  );
  const { versions, keywords } = info.data;
  const gitLastCommit = stripCarraigeReturn(
    await asyncExec("git rev-parse --short HEAD ", {
      silent: true
    })
  );
  const gitBranch = stripCarraigeReturn(
    await asyncExec("git branch | sed -n '/* /s///p'", { silent: true })
  );
  const localFilesChanged = (await asyncExec("git diff --name-only", {
    silent: true
  })).split("\n").length;

  const { name, version, scripts, repository } = getPackageJson();

  console.log(`Info on package ${chalk.green.bold(name)}`);
  const data = [
    [
      "NPM",
      `Latest published ${chalk.bold.green(
        versions.pop()
      )}; locally in package.json is ${chalk.bold.green(version)}`
    ],
    [
      "Repo ",
      repository && typeof repository === "object"
        ? (repository as IDictionary).url
        : repository
        ? repository
        : `The repository is ${chalk.bold("not")} stated!`
    ],
    ["Tags ", keywords],
    ["Scripts", Object.keys(scripts).join(", ")],
    [
      "GIT",
      `Latest commit ${chalk.bold.green(gitLastCommit)} ${chalk.bold.italic(
        "@ " + gitBranch
      )}; ${chalk.bold.green(String(localFilesChanged))} files changed locally`
    ]
  ];
  const config = {
    columns: {
      0: { width: 10, alignment: "center" },
      1: { width: 69 }
    }
  };

  console.log(table(data, config as any));
}

function stripCarraigeReturn(input: string) {
  return input.replace(/\n/, "");
}

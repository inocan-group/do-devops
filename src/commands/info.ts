import chalk from "chalk";
import {
  getPackageJson,
  getGitBranch,
  getGitLastCommit,
  getPackageInfo,
  green,
  dim
} from "../shared";
import { asyncExec } from "async-shelljs";
import { IDictionary, INpmInfo } from "common-types";
import { table } from "table";
import { format, parseISO } from "date-fns";

export const description = `Summarized information about the current repo`;
export const options = [
  {
    name: "test",
    alias: "t",
    type: String,
    group: "info",
    description: "sends output to the filename specified",
    typeLabel: "<filename>"
  }
];

/**
 * Gets the `git` and `npm` version of a file as well as
 * whether the local copy is dirty.
 */
export async function handler(argv: string[], opts: any) {
  // const config = await getConfig();
  let npm: INpmInfo;
  try {
    npm = await getPackageInfo();
  } catch (e) {
    // appears NOT to be a NPM package
  }
  const pkg = await getPackageJson();
  const priorVersions = npm
    ? npm.versions
        .filter(i => i !== npm.version)
        .slice(0, 5)
        .join(", ")
    : "";
  const gitLastCommit = await getGitLastCommit();
  const branch = await getGitBranch();
  const localFilesChanged = (await asyncExec("git diff --name-only", {
    silent: true
  })).split("\n").length;
  const dateFormat = "ddd DD MMM YYYY";
  /**
   * NPM Info based on verbose flag
   */
  const npmInfo = [
    [
      true,
      npm
        ? chalk`This repo was first published on {green ${format(
            parseISO(npm.time.created),
            dateFormat
          )}} and last modified on {green ${format(
            parseISO(npm.time.modified),
            dateFormat
          )}}.\n\n`
        : ""
    ],
    [
      false,
      npm
        ? chalk`The latest published version is ${chalk.bold.green(
            npm.version
          )} [ ${format(
            parseISO(npm.time[npm.version]),
            dateFormat
          )} ].\nLocally in package.json, version is ${chalk.bold.green(
            pkg.version
          )}.`
        : `Locally in {italic package.json}, the version is ${chalk.bold.green(
            pkg.version
          )} but this is {italic not} an npm package.`
    ],
    [true, chalk`\n\nPrior versions include: {italic ${priorVersions}}`],
    [
      true,
      npm && npm.author
        ? chalk`\n\nThe author of the repo is {green {bold ${
            typeof npm.author === "string" ? npm.author : npm.author.name
          }${
            typeof npm.author === "object" && npm.author.email
              ? ` <${npm.author.email}>`
              : ""
          }}}`
        : ""
    ]
  ];
  const depsSummary = `There are ${green(
    Object.keys(pkg.dependencies).length
  )} dependencies${
    npm
      ? chalk`, with a total of ${green(
          npm.dist.fileCount
        )} files\nand a unpacked size of ${green(
          npm.dist.unpackedSize / 1000,
          chalk` {italic kb}`
        )}.`
      : "."
  }`;
  const depDetails = `${depsSummary}\n\nThe dependencies are:\n - ${dim(
    Object.keys(pkg.dependencies).join("\n - ")
  )}`;

  const pkgJson = getPackageJson();

  console.log(`Info on package ${chalk.green.bold(pkg.name)}`);
  const data = [
    [
      "Desc ",
      description
        ? pkg.description
        : chalk.bold.italic("no description provided!")
    ],
    [
      "NPM",
      npmInfo
        .filter(i => opts.verbose || !i[0])
        .map(i => i[1])
        .join("")
    ],
    ["Deps ", opts.verbose === true ? depDetails : depsSummary],
    [
      "Repo ",
      pkg.repository && typeof pkg.repository === "object"
        ? (pkg.repository as IDictionary).url
        : pkg.repository
        ? pkg.repository
        : chalk.red(`The repository is ${chalk.bold("not")} stated!`)
    ],
    ["Tags ", pkg.keywords],
    ["Scripts", Object.keys(pkg.scripts).join(", ")],
    [
      "GIT",
      `Latest commit ${green(gitLastCommit)} ${chalk.bold.italic(
        "@ " + branch
      )}; ${green(String(localFilesChanged))} files changed locally`
    ]
  ];
  const tblConfig = {
    columns: {
      0: { width: 10, alignment: "center" },
      1: { width: 69 }
    }
  };

  console.log(table(data, tblConfig as any));
}

function stripCarraigeReturn(input: string) {
  return input.replace(/\n/, "");
}

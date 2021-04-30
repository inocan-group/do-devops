import { asyncExec } from "async-shelljs";
import chalk from "chalk";
import path from "path";
import { IDictionary, INpmInfo } from "common-types";
import { format, parseISO } from "date-fns";
import { table, TableUserConfig } from "table";
import { DoDevopObservation, IGlobalOptions } from "~/@types";
import { getObservations } from "~/shared/observations";
import { currentDirectory, symlinks } from "~/shared/file";
import { convertGitUrlToHttp, getCurrentGitBranch, getGitLastCommit } from "~/shared/git";
import { askConfirmQuestion, resolvePackageManagerConflict } from "~/shared/interactive";
import { getExternalPackageJson, getPackageJson } from "~/shared/npm";
import { dim, emoji, green } from "~/shared/ui";

/**
 * if user adds packages to the `pp info [p1] [p2]` this function will respond
 */
export async function thisRepo(opts: IGlobalOptions, observations: Set<DoDevopObservation>) {
  // const config = await getConfig();
  let npm: INpmInfo | undefined;
  try {
    npm = await getExternalPackageJson();
  } catch {
    // appears NOT to be a NPM package
  }
  const pkg = getPackageJson();
  const linkedRepos = symlinks(currentDirectory("node_modules")).filter(
    (s) => !s.linkTo.startsWith(".pnpm/")
  );
  const pkgManagerConflict = observations.has("packageManagerConflict")
    ? chalk`- {yellow {bold ${emoji.hazzard}}} there are conflicts in lock files from more than one package manager!`
    : false;
  if (pkgManagerConflict) {
    console.log(pkgManagerConflict);
    const cont = await askConfirmQuestion("Resolve this conflict?");
    if (cont) {
      await resolvePackageManagerConflict(observations);
    }
  }
  observations = getObservations();

  const linked =
    linkedRepos.length > 0
      ? [
          "Linked\nRepos",
          linkedRepos
            .map((r) => chalk`{bold ${r.file} -} {dim ${path.posix.resolve(r.linkTo)}}`)
            .join("\n"),
        ]
      : undefined;

  const pkgExports = [
    { name: "commonjs", value: pkg.main },
    { name: "es-module", value: pkg.module },
    { name: "typings", value: pkg.typings || pkg.types },
  ].filter((i) => i.value);
  const exportsRow =
    pkgExports.length > 0
      ? ["Exports", pkgExports.map((i) => chalk`{bold ${i.name}} - {dim ${i.value}}`).join("\n")]
      : ["", ""];

  const priorVersions = npm
    ? npm.versions
        .filter((i) => i !== npm?.version)
        .slice(0, 5)
        .join(", ")
    : "";
  const gitLastCommit = await getGitLastCommit();
  const branch = await getCurrentGitBranch();
  const localFilesChanged = (
    await asyncExec("git diff --name-only", {
      silent: true,
    })
  ).split("\n").length;
  const dateFormat = "ddd dd MMM yyyy";
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
          )}} and last modified on {green ${format(parseISO(npm.time.modified), dateFormat)}}.\n\n`
        : "",
    ],
    [
      false,
      npm
        ? chalk`The latest published version is ${chalk.bold.green(npm.version)} [ ${format(
            parseISO(npm.time[npm.version]),
            dateFormat
          )} ].\nLocally in package.json, version is ${chalk.bold.green(pkg.version)}.`
        : chalk`Locally in {italic package.json}, the version is ${chalk.bold.green(
            pkg.version
          )} but this is {italic not} an npm package.`,
    ],
    [true, chalk`\n\nPrior versions include: {italic ${priorVersions}}`],
    [
      true,
      npm && npm.author
        ? chalk`\n\nThe author of the repo is {green {bold ${
            typeof npm.author === "string" ? npm.author : npm.author.name
          }${typeof npm.author === "object" && npm.author.email ? ` <${npm.author.email}>` : ""}}}`
        : "",
    ],
  ];
  const depsSummary = `This repo has ${green(
    Object.keys(pkg?.dependencies || {}).length
  )} dependencies${
    npm
      ? chalk`, with a total of ${green(npm.dist.fileCount)} files\nand a unpacked size of ${green(
          npm.dist.unpackedSize / 1000,
          chalk` {italic kb}`
        )}.`
      : "."
  }`;
  const depDetails = `${depsSummary}\n\nThe dependencies are:\n - ${dim(
    Object.keys(pkg?.dependencies || {}).join("\n - ")
  )}`;

  console.log(chalk`Info on package {green {bold ${pkg.name}}}\n`);
  const data = [
    [
      chalk.bold("Desc"),
      pkg.description ? pkg.description : chalk.bold.italic("no description provided!"),
    ],
    ...exportsRow,
    [
      "NPM",
      npmInfo
        .filter((i) => opts.verbose || !i[0])
        .map((i) => i[1])
        .join(""),
    ],
    [chalk.bold("Deps"), opts.verbose === true ? depDetails : depsSummary],
    [
      "Repo ",
      pkg.repository && typeof pkg.repository === "object"
        ? convertGitUrlToHttp((pkg.repository as IDictionary).url)
        : pkg.repository
        ? convertGitUrlToHttp(pkg.repository)
        : chalk.red(`The repository is ${chalk.bold("not")} stated!`),
    ],
    ["Scripts", Object.keys(pkg?.scripts || {}).join(", ")],
    [
      "GIT",
      `Latest commit ${green(gitLastCommit)} ${chalk.bold.italic("@ " + branch)}\n${green(
        String(localFilesChanged)
      )} files changed locally`,
    ],
    ["Tags ", pkg.keywords ? pkg.keywords.join(", ") : chalk.italic.dim("none")],
  ].filter((i) => Array.isArray(i) && i[0]) as unknown[][];

  if (linked) {
    data.push(linked);
  }

  const tblConfig: TableUserConfig = {
    columns: [{ alignment: "left" }, { width: 69, wrapWord: true }],
  };

  console.log(table(data, tblConfig));
}

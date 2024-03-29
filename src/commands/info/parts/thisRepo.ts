/* eslint-disable unicorn/no-await-expression-member */
import { asyncExec } from "async-shelljs";
import chalk from "chalk";
import path from "node:path";
import { IDictionary, INpmInfo, IPackageJson } from "common-types";
import { format, parseISO } from "date-fns";
import { table, TableUserConfig } from "table";
import { DoDevopObservation, Options } from "src/@types";
import { getObservations } from "src/shared/observations";
import {
  convertGitUrlToHttp,
  getCurrentGitBranch,
  getGitLastCommit,
  getGitRemotes,
} from "src/shared/git";
import { askConfirmQuestion, resolvePackageManagerConflict } from "src/shared/interactive";
import { getExternalPackageJson, getPackageJson } from "src/shared/npm";
import {  emoji, green } from "src/shared/ui";
import { monorepoInfo } from "./components/monorepo";
import { currentDirectory } from "src/shared/file/base-paths/currentDirectory";
import { symlinks } from "src/shared/file/utility/symlinks";

/**
 * if user adds packages to the `pp info [p1] [p2]` this function will respond
 */
export async function thisRepo(opts: Options, observations: Set<DoDevopObservation>) {
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
    ? `- ${chalk.yellow.bold`${emoji.hazard}`} there are conflicts in lock files from more than one package manager!`
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
            .map((r) => `${chalk.bold`${r.file} -`} ${chalk.dim`${path.posix.resolve(r.linkTo)}`}`)
            .join("\n"),
        ]
      : undefined;

  const pkgExports = [
    { name: "commonjs", value: pkg.main },
    { name: "esm", value: pkg.module },
    { name: "typings", value: pkg.typings || pkg.types },
  ].filter((i) => i.value);
  const exportsRow =
    pkgExports.length > 0
      ? ["Exports", pkgExports.map((i) => `${chalk.bold(i.name)} - ${chalk.dim(i.value)}`).join("\n")]
      : ["Exports", chalk.italic`no exports found in ${chalk.blue`package.json`}`];

  const priorVersions = npm
    ? npm.versions
        .filter((i) => i !== npm?.version)
        .slice(0, 5)
        .join(", ")
    : "";

  const dateFormat = "dd MMM yyyy";

  // GIT
  const gitLastCommit = await getGitLastCommit();
  // eslint-disable-next-line unicorn/no-await-expression-member
  const gitRemotes = (await getGitRemotes()).map((i) => `- ${chalk.bold(i.name)}: ${chalk.dim(i.refs.fetch)}`);
  let gitInfo = gitLastCommit
    ? `- Latest commit ${green(gitLastCommit.hash.slice(0, 8))} on ${green(gitLastCommit.refs)}\n- committed by ${green(gitLastCommit.author_name)} ${chalk.dim(`<${gitLastCommit.author_email}>`)} on ${green(format(new Date(gitLastCommit.date), dateFormat))}`
    : chalk.italic.dim`no commits found`;

  const localFilesChanged = (
    await asyncExec("git diff --name-only", {
      silent: true,
    })
  ).split("\n").length;

  const currentGitBranch = await getCurrentGitBranch();

  gitInfo = gitInfo +
  `\n- ${chalk.yellow(String(localFilesChanged))} files changed locally on ${chalk.yellow(currentGitBranch)}\n\n- Remotes are:\n  ${gitRemotes}`;

  /**
   * NPM Info based on verbose flag
   */
  const npmInfo = [
    [
      true,
      npm
        ? `This repo was first published on ${green(format(parseISO(npm.time.created), dateFormat))} and last modified on ${green(format(parseISO(npm.time.modified), dateFormat))}.\n\n`
        : "",
    ],
    [
      false,
      npm
        ? `The latest published version is ${chalk.bold.green(npm.version)} [ ${format(
            parseISO(npm.time[npm.version]),
            dateFormat
          )} ].\nLocally in package.json, version is ${chalk.bold.green(pkg.version)}.`
        : `Locally in ${chalk.italic`package.json`}, the version is ${chalk.bold.green(
            pkg.version
          )} but this is ${chalk.italic`not`} an npm package.`,
    ],
    [true, `\n\nPrior versions include: ${chalk.italic.dim(priorVersions)}`],
    [
      true,
      npm && npm.author
        ? `\n\nThe author of the repo is ${chalk.green.bold(
            typeof npm.author === "string" ? npm.author : npm.author.name
          )}${typeof npm.author === "object" && npm.author.email ? ` <${npm.author.email}>` : ""}`
        : "",
    ],
  ];

  const deps: { name: string; prop: keyof IPackageJson; count: number }[] = [
    {
      name: "dependencies",
      prop: "dependencies",
      count: Object.keys(pkg?.dependencies || {}).length,
    },
    {
      name: `${chalk.italic`dev`} dependencies`,
      prop: "devDependencies",
      count: Object.keys(pkg?.devDependencies || {}).length,
    },
    {
      name: `${chalk.italic`optional`} dependencies`,
      prop: "optionalDependencies",
      count: Object.keys(pkg?.optionalDependencies || {}).length,
    },
    {
      name: `${chalk.italic`peer`} dependencies`,
      prop: "peerDependencies",
      count: Object.keys(pkg?.peerDependencies || {}).length,
    },
  ].filter((d) => d.count > 0);

  const depsSummary =
    deps.length > 0
      ? `This repo has ${deps.map((d) => chalk.green` ${d.count}} ${d.name}`).join(", ")}`
      : chalk.italic.dim` no dependencies}}`;

  `This repo has ${green(
    Object.keys(pkg?.dependencies || {}).length
  )} dependencies, and {green ${
    Object.keys(pkg?.devDependencies || {}).length
  }} ${chalk.italic`dev`} dependencies`;
  const depDetails = `${depsSummary}\n\nThe dependencies are:\n - ${chalk.dim(
    Object.keys(pkg?.dependencies || {}).join("\n - ")
  )}`;

  console.log(`Info on package ${chalk.bold.green(pkg.name)}\n`);
  const npmInformation =
    pkg.private === true
      ? `This is a private repository (not published to NPM)`
      : npmInfo
          .filter((i) => opts.verbose || !i[0])
          .map((i) => i[1])
          .join("");

  const repoInfo =
    pkg.repository && typeof pkg.repository === "object"
      ? convertGitUrlToHttp((pkg.repository as IDictionary).url)
      : pkg.repository
      ? convertGitUrlToHttp(pkg.repository)
      : chalk.red`The repository is ${chalk.bold(
          "not"
        )} stated in ${chalk.blue`package.json`}; it may be deduced by the GIT remotes:\n${gitRemotes.join(
          "\n"
        )}`;

  const data = [
    await monorepoInfo(observations),
    [
      chalk.bold("Desc"),
      pkg.description ?? chalk.bold.italic`no description provided!`,
    ],
    exportsRow,
    ["NPM", npmInformation],
    [chalk.bold("Deps"), opts.verbose === true ? depDetails : depsSummary],
    ["Repo ", repoInfo],
    [
      "Scripts",
      Object.keys(pkg?.scripts || {})
        .map((i) => (i.includes(":") ? chalk.dim`${i.split(":")[0]}}:${i.split(":")[1]}` : i))
        .join(", "),
    ],
    [
      "GIT",
      gitInfo
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

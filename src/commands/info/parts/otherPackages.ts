import chalk from "chalk";
import { IDictionary, INpmInfo,isNpmInfoRepository } from "common-types";
import { DoDevopObservation, Options, INpmInfoTable } from "~/@types";
import { convertGitUrlToHttp } from "~/shared/git";
import { getExternalPackageJson } from "~/shared/npm";
import { consoleDimensions, TableColumn, toTable } from "~/shared/ui";
import { formatDistanceToNow} from "date-fns";

/**
 * Gets info on one or more NPM repos.
 */
async function getNpmInfo(pkgs: string[], _opts: IDictionary) {
  const successful: { name: string; value: INpmInfo }[] = [];
  const failed: { name: string; error: string }[] = [];

  const waitFor: Promise<any>[] = [];

  for (const pkg of pkgs) {
    waitFor.push(
      getExternalPackageJson(pkg)
        .then(value => successful.push({name: pkg, value}))
        .catch(error => failed.push({ name: pkg, error: error instanceof Error ? error.message : String(error)}))
    );
  }
  await Promise.all(waitFor);

  return { successful, failed };
}

function allVersions(repo: INpmInfo) {
  return repo["versions"];
}

function getPriorVersion(repo: INpmInfo) {
  const idx = allVersions(repo)?.findIndex(i => i === getLatest(repo));
  return idx > 1 ? allVersions(repo)[idx-1] : undefined;
}

function getTagTiming(repo: INpmInfo, tag: string) {
  const timestamp = repo.time[tag];
  if (!timestamp) {return "unknown";};

  return `${formatDistanceToNow(new Date(timestamp))} ago`;  
}

function getLatest(repo: INpmInfo) {
  return repo["dist-tags"]?.latest || repo.version;
}

/**
 * Gets the URLs for the "home page" or repo
 */
function getUrls(npm: INpmInfo): {homepage?: string; repo?: string } {
  const homepage = npm.homepage;
  const repo = isNpmInfoRepository(npm.repository)
    ? npm?.repository?.url || chalk`{red no repo found!}`
    : npm.repository || chalk`{red no repo found!}`;

  return {
    homepage,
    repo: convertGitUrlToHttp(repo)
  };
}

function getExports(repo: INpmInfo) {
  const repoExports = [];
  if (repo.main) {
    repoExports.push("cjs");
  }
  if (repo.module) {
    repoExports.push("es");
  }
  if (repo.typings || repo.types) {
    repoExports.push("types");
  }

  return repoExports.length > 0 ? chalk.italic(repoExports.join(", ")) : chalk.italic.dim("none");
}

/** approx width requirements for each column */
const COL_WIDTH = 3;
const colPaddingRequirement = (cols: number) => (2 * COL_WIDTH) + ((cols-1) * COL_WIDTH);

/**
 * if user adds packages to the `pp info [p1] [p2]` this function will respond
 */
export async function otherPackages(
  pkgs: string[],
  opts: Options,
  _observations: Set<DoDevopObservation>
) {
  const info = await getNpmInfo(pkgs, opts);
  const data:( INpmInfoTable & {license : string})[] = [];

  for (const repo of info.successful) {
    const timing = (v: string | undefined) => v ? ({ version: v, timing: getTagTiming(repo.value, v)}) : undefined;
    const latest = timing(getLatest(repo.value));
    const prior = timing(getPriorVersion(repo.value));

    const urls = getUrls(repo.value);
    const author = repo.value.author
      ? typeof repo.value.author === "string" ? repo.value.author : `${repo.value.author.name}${repo.value.author.email ? `<${repo.value.author.email}>` : ""}`
      : undefined;

    const license = repo.value.license ? repo.value.license.slice(0,8) : chalk`{red {italic missing}}`;
    const urlDescription = chalk`{bold Repo:} ${urls.repo}${urls.homepage ? chalk`\n{bold Homepage:} ${urls.homepage}` : ""}${author ? chalk`\n{bold Author:} ${author}` : ""}`;

    data.push({
      repo: repo.name,
      latest: opts.verbose
        ? chalk`${latest?.version} - {italic ${latest?.timing.replace("about ", "")}}${prior ? chalk`\n{dim ${prior?.version} - {italic ${prior?.timing.replace("about ", "")}}}` : ""}`
        : getLatest(repo.value),
      license,
      exports: getExports(repo.value),
      description: repo.value.description ? [repo.value.description, urlDescription].join("\n\n") : urlDescription,
    });
  }
  const { width: available } = consoleDimensions();

  const colWidth = (col: string ) => {
    const colData = data.map(i => i[col as keyof typeof i]);
    const adjustedWidth = (content?: string) => content ? Math.max(...colData.map(i => i?.length)) : 0;
    
    return colData.length === 0 ? 0 : Math.max(...colData.map(adjustedWidth));
  };

  const repoWidth = Math.max(colWidth("repo"), 5);
  const latestWidth = opts.verbose ? 24 : 8;
  const exportsWidth = Math.min(opts.verbose ? 8 : 14, colWidth("exports"));
  const licenseWidth = 5;
  const descWidth = available - (repoWidth + latestWidth + exportsWidth + licenseWidth + colPaddingRequirement( 5));

  const cols: TableColumn<INpmInfoTable, any>[] = [
    { name: "Repo", col: "repo", format: { width: repoWidth } },
    { name: "Latest", col: "latest", format: { width: latestWidth, alignment: opts.verbose ? "left" : "center" } },
    { name: "Lic", col: "license", format: { width: licenseWidth, alignment: "center"}},
    { name: "Exports", col: "exports", format: { width: exportsWidth, wrapWord: true } },
    { name: "Description", col: "description", format: { wrapWord: true, width: descWidth  } },
    ];

  console.log(
    toTable(
      data,
      ...cols
    )
  );
}

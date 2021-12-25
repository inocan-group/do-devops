import chalk from "chalk";
import { IDictionary, INpmInfo, isNpmInfoRepository } from "common-types";
import { DoDevopObservation, Options, INpmInfoTable } from "~/@types";
import { convertGitUrlToHttp } from "~/shared/git";
import { getExternalPackageJson } from "~/shared/npm";
import { consoleDimensions, toTable } from "~/shared/ui";

async function getNpmInfo(pkgs: string[], _opts: IDictionary) {
  const successful: { name: string; value: INpmInfo }[] = [];
  const failed: { name: string; error: string }[] = [];

  for (const pkg of pkgs) {
    try {
      const info = await getExternalPackageJson(pkg);
      successful.push({ name: pkg, value: info });
    } catch (error) {
      failed.push({ name: pkg, error: (error as Error).message });
    }
  }

  return { successful, failed };
}

function getLatest(repo: INpmInfo) {
  return repo["dist-tags"]?.latest || repo.version;
}

function getUrls(repo: INpmInfo) {
  const hp = repo.homepage;
  const gitUrl = isNpmInfoRepository(repo.repository)
    ? repo.repository.url || ""
    : repo.repository || "";
  return hp
    ? gitUrl && !hp.includes("github.com")
      ? `${hp}\n${convertGitUrlToHttp(gitUrl)}`
      : hp
    : "";
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

/**
 * if user adds packages to the `pp info [p1] [p2]` this function will respond
 */
export async function otherPackages(
  pkgs: string[],
  opts: Options,
  _observations: Set<DoDevopObservation>
) {
  const info = await getNpmInfo(pkgs, opts);
  const data: INpmInfoTable[] = [];

  for (const repo of info.successful) {
    data.push({
      repo: repo.name,
      latest: getLatest(repo.value),
      exports: getExports(repo.value),
      description: repo.value.description || chalk`{italic no description}`,
      urls: getUrls(repo.value),
    });
  }
  const { width: w } = consoleDimensions();

  console.log(
    toTable(
      data,
      { name: "Repo", col: "repo", format: { width: 20 } },
      { name: "Latest", col: "latest", format: { width: 8, alignment: "center" } },
      { name: "Exports", col: "exports", format: { width: 14 } },
      { name: "Description", col: "description", format: { wrapWord: true, width: 50 } },
      {
        name: "URLs",
        col: "urls",
        format: { width: Math.min(w - 110, 50) },
        minWidth: 150,
      }
    )
  );
}

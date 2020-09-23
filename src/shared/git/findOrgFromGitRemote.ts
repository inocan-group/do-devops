import { getGitRemotes } from "../../shared";

/**
 * Looks in the **git** remotes and -- favoring "origin" -- trys to determine
 * what the organization or user the repo is published under. If there are no remotes, or there
 * is any other failure to find the org name this function will return `false`.
 */
export async function findOrgFromGitRemote(baseDir?: string): Promise<string | false> {
  try {
    baseDir = baseDir ? baseDir : process.cwd();
    const remotes = await getGitRemotes(baseDir);
    if (remotes.length === 0) {
      console.log("no remotes!");
      return false;
    }
    const origin = remotes.find((r) => r.name === "origin");
    const findOrg = /.*:(.*)\//gm;

    const [_, org] = origin
      ? findOrg.exec(origin.refs.fetch || origin.refs.push)
      : findOrg.exec(remotes[0].refs.fetch || remotes[0].refs.push);

    return org;
  } catch (e) {
    return false;
  }
}

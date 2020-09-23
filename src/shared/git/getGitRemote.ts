import { asyncExec } from "async-shelljs";
import { git } from "./git";

/**
 * returns a list of defined _remotes_ for the git repo; each remote "name" will have
 * both a "fetch" and "push" reference defined. If no remotes are found then an empty
 * array will be returned.
 *
 * Note: the repo is presumed to be based in the CWD, if another directory
 * is intended then this must be passed in as the `baseDir` parameter
 */
export async function getGitRemotes(baseDir?: string) {
  try {
    baseDir = baseDir ? baseDir : process.cwd();
    const g = git(baseDir);
    const remotes = await g.getRemotes(true);

    return remotes.length > 0 ? remotes : [];
  } catch (e) {
    return [];
  }
}

import { asyncExec } from "async-shelljs";

/**
 * returns the current git branch in the given repo
 */
export async function getGitBranch() {
  const branch = (await asyncExec("git branch | sed -n '/* /s///p'", {
    silent: true
  })).replace("\n", "");

  return branch;
}

import { asyncExec } from "async-shelljs";
import { git } from "./git";

/**
 * returns the _current_ git branch in the given repo
 */
export async function getCurrentGitBranch(baseDir?: string) {
  baseDir = baseDir ? baseDir : process.cwd();
  const g = git(baseDir);
  const branch = await g.branch();

  return branch.current;
}

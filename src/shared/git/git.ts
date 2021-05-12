import simpleGit, { SimpleGitOptions } from "simple-git";
import { currentDirectory } from "../file";

/**
 * Returns an instance of the [`SimpleGit` library](https://github.com/steveukx/git-js)
 */
export function git(dir?: string, options: Partial<SimpleGitOptions> = {}) {
  if (!dir) {
    dir = currentDirectory();
  }
  return simpleGit(dir, options);
}

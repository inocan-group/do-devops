import simpleGit, { SimpleGitOptions } from "simple-git";

/**
 * Returns an instance of the [`SimpleGit` library](https://github.com/steveukx/git-js)
 */
export function git(baseDir: string = undefined, options: Partial<SimpleGitOptions> = {}) {
  if (!baseDir) {
    baseDir = process.cwd();
  }
  return simpleGit(baseDir, options);
}

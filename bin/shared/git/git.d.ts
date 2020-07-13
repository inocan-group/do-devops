import { SimpleGitOptions } from "simple-git";
/**
 * Returns an instance of the [`SimpleGit` library](https://github.com/steveukx/git-js)
 */
export declare function git(baseDir?: string, options?: Partial<SimpleGitOptions>): import("simple-git").SimpleGit;

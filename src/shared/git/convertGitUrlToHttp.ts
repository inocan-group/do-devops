
/**
 * Converts a "git url" of the format `git@github.com:org/repo.git` and
 * converts it to an HTTP url to the repo.
 */
export function convertGitUrlToHttp(gitUrl: string) {
  return gitUrl
    .replace(/git(\+(ssh|https)){0,1}:\/\/(git@){0,1}/, "https://")
    .replace(/\.git$/, "");
}

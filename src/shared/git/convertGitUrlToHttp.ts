export function convertGitUrlToHttp(gitUrl: string) {
  return gitUrl
    .replace(/git(\+(ssh|https)){0,1}:\/\/(git@){0,1}/, "https://")
    .replace(/\.git$/, "");
}

import { git } from "./git";

export async function getGitLastCommit() {
  const latest = (await git().log({ maxCount: 1, strictDate: true })).latest;
  return latest;
}

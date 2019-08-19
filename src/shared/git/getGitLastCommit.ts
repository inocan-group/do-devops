import { asyncExec } from "async-shelljs";

export async function getGitLastCommit() {
  const result = await asyncExec("git rev-parse --short HEAD ", {
    silent: true
  });

  return result.replace("\n", "");
}

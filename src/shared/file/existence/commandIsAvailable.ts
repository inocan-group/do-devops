import { spawnSync } from "child_process";

export function commandIsAvailable(cmd: string): boolean {
  const thread = spawnSync("which", [cmd], {stdio: "inherit", timeout: 0});
  if(thread.error) {return false;};

  return true;
}
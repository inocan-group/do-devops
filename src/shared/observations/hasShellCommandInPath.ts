import { spawnSync } from "node:child_process";

export const hasShellCommandInPath = (cmd: string): boolean => {
  try {
    const results = spawnSync("which", [cmd], { encoding: "utf8", stdio: "ignore" });

    return results.status === 0 ? true : false;
  } catch {
    return false;
  }
};

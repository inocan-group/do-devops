import { execSync } from "node:child_process";

export const hasShellCommandInPath = (cmd: string): boolean => {
  try {
    cmd = `which $cmd`;
    const results = execSync(cmd, { encoding: "utf8" });
    return results.includes("not found") ? false : true;
  } catch {
    return false;
  }
};

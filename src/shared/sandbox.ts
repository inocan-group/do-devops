import { asyncExec } from "async-shelljs";
import { getGitBranch } from "./git/index";
import { ISandboxStrategy } from "../@types";

/**
 * Determines the `stage` to replace "dev" with a more
 * isolated sandboxing strategy; based on the user's
 * sandbox configuration
 */
export async function sandbox(strategy: ISandboxStrategy) {
  switch (strategy) {
    case "user":
      const user = (await asyncExec("git config user.name"))
        .replace(/ /g, "")
        .replace(/\-/g, "")
        .toLowerCase();
      return user || "dev";
    case "branch":
      const branch = await getGitBranch();
      switch (branch) {
        case "develop":
          return "dev";
        case "master":
          throw new Error(
            'You can not deploy stage "dev" to the master branch.'
          );
        default:
          const isFeatureBranch = branch.includes("feature");
          return isFeatureBranch
            ? branch.replace(/.*\//, "").replace(/\-/g, "")
            : "dev";
      }

    default:
      return "dev";
  }
}

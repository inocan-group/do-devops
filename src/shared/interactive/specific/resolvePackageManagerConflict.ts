import { DoDevopObservation } from "src/@types";
import { askListQuestion } from "src/shared/interactive";
import { saveProjectConfig } from "src/shared/config";
import { removeOtherLockFiles } from "src/shared/npm";
import chalk from "chalk";

export async function resolvePackageManagerConflict(observations: Set<DoDevopObservation>) {
  const pkgManager = await askListQuestion(
    "Which package manager do you expect to use in this repo?",
    ["npm", "pnpm", "yarn"] as const,
    {
      default: observations.has("pnpm") ? "pnpm" : observations.has("yarn") ? "yarn" : "npm",
    }
  );
  await saveProjectConfig({ general: { pkgManager } });
  const removed = await removeOtherLockFiles(pkgManager);
  if (removed.length > 0) {
    console.log(
      `- removed ${removed.length} redundant lock file${
        removed.length > 1 ? "s" : ""
      }: ${chalk.italic.dim(removed.join(", "))}}`
    );
  }
}

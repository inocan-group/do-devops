import { DoDevopObservation } from "~/@types";
import { askListQuestion } from "~/shared/interactive";
import { saveProjectConfig } from "~/shared/config";
import { removeOtherLockFiles } from "~/shared/npm";
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
      chalk`- removed ${removed.length} redundant lock file${
        removed.length > 1 ? "s" : ""
      }: {italic {dim ${removed.join(", ")}}}`
    );
  }
}

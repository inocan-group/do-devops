/* eslint-disable unicorn/no-process-exit */
import chalk from "chalk";
import { IDoDevopsCommand } from "src/@types/command";
import { proxyToPackageManager } from "src/shared/core";
import { pkgDepsInTable } from "src/shared/npm";

const command: IDoDevopsCommand = {
  kind: "why",
  handler: async ({ observations, raw }) => {
    if (raw.length === 0) {
      console.log(
        `- invalid command syntax, you must state a repo to report on: {blue dd {bold [repo]} {italic [opts]}}\n`
      );
      if (observations.has("packageJson")) {
        console.log(
          chalk.gray` - you often want to target a repo that is listed as a dependency in this repo.\n- The deps in this repo are ({italic excluding dev deps}):}\n`
        );
        console.log(pkgDepsInTable({ ignoreDevDeps: true }));
      }
      process.exit();
    }

    await proxyToPackageManager("why", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'why' command",
};

export default command;

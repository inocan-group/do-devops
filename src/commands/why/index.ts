import chalk from "chalk";
import { IDoDevopsCommand } from "~/@types/command";
import { proxyToPackageManager } from "~/shared/core";
import { pkgDepsInTable } from "~/shared/npm";

const command: IDoDevopsCommand = {
  kind: "why",
  handler: async ({ observations, raw }) => {
    if (raw.length === 0) {
      console.log(
        chalk`- invalid command syntax, you must state a repo to report on: {blue dd {bold [repo]} {italic [opts]}}\n`
      );
      if (observations.includes("packageJson")) {
        console.log(
          chalk`{gray - you often want to target a repo that is listed as a dependency in this repo.\n- The deps in this repo are ({italic excluding dev deps}):}\n`
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

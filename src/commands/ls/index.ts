/* eslint-disable unicorn/no-process-exit */
import chalk from "chalk";
import { IDoDevopsCommand } from "~/@types/command";
import { proxyToPackageManager } from "~/shared/core";
import { askForDependency } from "~/shared/interactive";

const command: IDoDevopsCommand = {
  kind: "ls",
  handler: async ({ observations, raw, argv }) => {
    if (!observations.has("packageJson")) {
      console.log(
        chalk`- the {italic ls} command is only useful in a directory with a {blue package.json}`
      );
      process.exit();
    }
    if (argv.length === 0) {
      console.log(
        chalk`- in order to run the {italic ls} command, we will need you to choose a dependency of this repo\n`
      );
      const dep = await askForDependency(observations);
      if (!dep) {
        process.exit();
      }

      raw = [dep];
    }

    await proxyToPackageManager("ls", observations, raw);
    return;
  },
  greedy: true,
  description: chalk`proxies your package manager's {italic ls} / {italic list} command to determine which versions of a dep you have`,
};

export default command;

/* eslint-disable unicorn/no-process-exit */
import chalk from "chalk";
import { IDoDevopsCommand } from "src/@types/command";
import { proxyToPackageManager } from "src/shared/core";
import { hasScript } from "src/shared/npm";

const command: IDoDevopsCommand = {
  kind: "watch",
  handler: async ({ observations, raw }) => {
    if (!observations.has("packageJson")) {
      console.log(
        `- ${chalk.italic`watching`} files in the repo is something which can only happen in directory with a ${chalk.blue`package.json`}`
      );
      process.exit();
    }

    if (observations.has("serverlessFramework")) {
      if (hasScript("watch")) {
        console.log(
          chalk.gray`y - {bold note:} this is a serverless project but because you have a "watch" script, we will prefer that over the default do-devops watcher`
        );

        proxyToPackageManager("watch", observations, raw);
        process.exit();
      } else {
        console.log(`- starting the Serverless Devops watcher`);
        //TODO: implement
        process.exit();
      }
    }

    await proxyToPackageManager("watch", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'watch' command",
};

export default command;

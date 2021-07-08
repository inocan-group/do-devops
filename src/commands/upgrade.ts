import chalk from "chalk";
import { IDoDevopsCommand } from "~/@types/command";
import { proxyToPackageManager } from "~/shared/core";

const command: IDoDevopsCommand = {
  kind: "upgrade",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("upgrade", observations, raw);
    process.exit();
  },
  description: chalk`proxies your package manager's {bold italic upgrade} command`,
};

export default command;

import chalk from "chalk";
import { IDoDevopsCommand } from "~/@types/command";
import { proxyToPackageManager } from "~/shared/core";

const command: IDoDevopsCommand = {
  kind: "install",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("install", observations, raw);
    process.exit();
  },
  description: chalk`proxies your package manager's {bold italic install} command (and yarn's "add" command)`,
};

export default command;

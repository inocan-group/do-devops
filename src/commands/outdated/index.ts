import { IDoDevopsCommand } from "src/@types/command";
import { proxyToPackageManager } from "src/shared/core";

const command: IDoDevopsCommand = {
  kind: "outdated",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("outdated", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'outdated' command",
};

export default command;

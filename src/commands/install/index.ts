import { IDoDevopsCommand } from "~/@types/command";
import { proxyToPackageManager } from "~/shared/core";

const command: IDoDevopsCommand = {
  kind: "install",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("install", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'install' command",
};

export default command;

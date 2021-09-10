import { IDoDevopsCommand } from "~/@types/command";
import { proxyToPackageManager } from "~/shared/core";

const command: IDoDevopsCommand = {
  kind: "upgrade",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("upgrade", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'upgrade' command",
};

export default command;

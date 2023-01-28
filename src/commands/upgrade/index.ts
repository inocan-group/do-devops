import { Command } from "src/@types/command";
import { proxyToPackageManager } from "src/shared/core";

const command: Command = {
  kind: "upgrade",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("upgrade", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'upgrade' command",
};

export default command;

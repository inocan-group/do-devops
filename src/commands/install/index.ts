/* eslint-disable unicorn/no-process-exit */
import { IDoDevopsCommand } from "src/@types/command";
import { proxyToPackageManager } from "src/shared/core";

const command: IDoDevopsCommand = {
  kind: "install",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("install", observations, raw);
    process.exit();
  },
  description: `proxies your package manager's {bold italic install} command (and yarn's "add" command)`,
};

export default command;

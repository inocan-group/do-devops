/* eslint-disable unicorn/no-process-exit */
import chalk from "chalk";
import { spawnSync } from "node:child_process";
import { Command } from "src/@types/command";
import { commandIsAvailable } from "src/shared/file/existence/commandIsAvailable";
import { emoji } from "src/shared/ui";

const command: Command = {
  kind: "tree",
  handler: async ({ observations, raw, opts }) => {
    if (observations.has("cargo")) {
      const params = opts.verbose
        ? ["modules", "generate", "tree", "--with-types"]
        : ["modules", "generate", "tree"];
      console.error(
        `- proxying the "tree" command to ${chalk.blue.bold`cargo`} ${params.join(" ")}}`
      );
      const thread = spawnSync("cargo", params, { stdio: "inherit" });
      if (thread.error) {
        throw new Error(`- ${emoji.poop} ran into problems using cargo's modules plugin}`);
      }
    } else {
      if (commandIsAvailable("tree")) {
        const thread = spawnSync("tree", raw);
        if (thread.error) {
          throw new Error(`- ${emoji.poop} ran into problems using cargo's modules plugin}`);
        }
      } else {
        console.log(
          `- no "tree" binary was found in the path; if you're on Mac you can install with 'brew install tree'\n`
        );
      }
    }

    process.exit();
  },
  description:
    "if in Cargo/Rust dir then tries cargo's module tree plugin; otherwise proxies an 'in-path' tree executable ",
};

export default command;

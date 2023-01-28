import { exec } from "async-shelljs";
import chalk from "chalk";
import { exit } from "node:process";
import { Command } from "src/@types/command";
import { logger } from "src/shared/core";
import { askListQuestion } from "src/shared/interactive";
import { emoji } from "src/shared/ui";
import { IMadgeOptions, options } from "./parts/options";

const command: Command<IMadgeOptions> = {
  kind: "madge",
  handler: async ({ opts, argv }) => {
    const log = logger(opts);
    const flags: string[] = [];
    if (opts.verbose) {
      flags.push("--debug", "--warning");
    }
    if (opts.json) {
      flags.push("--json");
    }
    if (opts.extensions) {
      flags.push(`--extensions ${opts.extensions}`);
    } else {
      flags.push(`--extensions ts,js`);
    }
    if (opts.layout) {
      const valid = ["dot", "neato", "fdp", "sfdp", "twopi", "circo"];
      if (!valid.includes(opts.layout)) {
        log.info(
          `- ${emoji.warn} you passed in ${chalk.red`${opts.layout}`} for a ${chalk.italic`layout`}; this will likely not be recognized by ${chalk.blue`madge`} CLI`
        );
        log.info(chalk.gray`{ - valid layouts include: ${chalk.italic(valid.join(", "))}`);
      }
      flags.push(`--layout ${opts.layout}`);
    }
    if (opts["include-npm"]) {
      flags.push("--include-npm");
    }
    if (opts.image) {
      flags.push(`--image ${opts.image}`);
    }

    const dir = argv[0] || "src";

    if (!opts.circular && !opts.summary && !opts.orphans && !opts.leaves) {
      const which = await askListQuestion(
        `Which ${chalk.italic`Madge`} command(s) would you like to run?`,
        ["circular", "summary", "orphans", "leaves"] as const
      );
      opts[which] = true as any;
    }

    // commands
    if (opts.circular) {
      const cmd = `pnpx madge ${dir} --circular ${flags.join(" ")}`;
      log.info(`\n- running ${chalk.bold`madge`} with following command: ${chalk.blue(cmd)}`);
      const response = exec(cmd);
      if (response.code !== 0) {
        exit(response.code);
      }
    }

    if (opts.summary) {
      const cmd = `npx madge ${dir} --summary ${flags.join(" ")}`;
      log.info(`\n- running ${chalk.bold`madge`} with following command: ${chalk.blue(cmd)}`);
      const response = exec(cmd);
      if (response.code !== 0) {
        exit(response.code);
      }
    }

    if (opts.orphans) {
      const cmd = `npx madge ${dir} --orphans ${flags.join(" ")}`;
      log.info(`\n- running ${chalk.bold`madge`} with following command: ${chalk.blue(cmd)}`);
      const response = exec(cmd);
      if (response.code !== 0) {
        exit(response.code);
      }
    }

    if (opts.leaves) {
      const cmd = `npx madge --leaves ${flags.join(" ")}`;
      log.info(`\n- running ${chalk.bold`madge`} with following command: ${chalk.blue(cmd)}`);
      const response = exec(cmd);
      if (response.code !== 0) {
        exit(response.code);
      }
    }

    return;
  },
  description: `provides a proxy of the highly useful ${chalk.bold`madge`} utilities; by default running across all javascript and typescript files in the ${chalk.blue`src`} directory.`,
  options,
};

export default command;

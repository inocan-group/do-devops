import { exec } from "async-shelljs";
import chalk from "chalk";
import { IDoDevopsCommand } from "~/@types/command";
import { logger } from "~/shared/core";
import { askListQuestion } from "~/shared/interactive";
import { emoji } from "~/shared/ui";
import { IMadgeOptions, options } from "./parts/options";

const command: IDoDevopsCommand<IMadgeOptions> = {
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
          chalk`- ${emoji.warn} you passed in {red ${opts.layout}} for a {italic layout}; this will likely not be recognized by {blue madge} CLI`
        );
        log.info(chalk`{gray - valid layouts include: {italic ${valid.join(", ")}}}`);
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
      const which = await askListQuestion<keyof typeof opts>(
        chalk`Which {italic Madge} command(s) would you like to run?`,
        ["circular", "summary", "orphans", "leaves"]
      );
      opts[which] = true as any;
    }

    // commands
    if (opts.circular) {
      const cmd = `npx madge ${dir} --circular ${flags.join(" ")}`;
      log.info(chalk`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = exec(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }

    if (opts.summary) {
      const cmd = `npx madge ${dir} --summary ${flags.join(" ")}`;
      log.info(chalk`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = exec(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }

    if (opts.orphans) {
      const cmd = `npx madge ${dir} --orphans ${flags.join(" ")}`;
      log.info(chalk`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = exec(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }

    if (opts.leaves) {
      const cmd = `npx madge --leaves ${flags.join(" ")}`;
      log.info(chalk`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = exec(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }

    return;
  },
  description: chalk`provides a proxy of the highly useful {bold madge} utilities; by default running across all javascript and typescript files in the {blue src} directory.`,
  options,
};

export default command;

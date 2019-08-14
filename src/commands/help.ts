import commandLineUsage, { Section } from "command-line-usage";
import commandLineArgs from "command-line-args";
import chalk from "chalk";

import { commands } from "../shared";

export function help(
  optionList: commandLineArgs.CommandLineOptions[],
  fn?: string
) {
  const sections: commandLineUsage.Section[] = [
    {
      header: "Description",
      content: chalk`DevOps [DO] toolkit is a simple CLI interface to `
    }
  ];

  if (!fn) {
    sections.push({
      header: "Syntax",
      content: `ssm [command] <options>`
    });
    sections.push({
      header: "Commands",
      content: `valid commands are: ${chalk.grey.italic(commands().join(", "))}`
    });
  } else {
    sections.push({
      header: "Syntax",
      content: `ssm ${fn} <options>`
    });
  }

  sections.push({
    header: "Options",
    optionList
  } as Section);

  console.log(commandLineUsage(sections));
  process.exit();
}

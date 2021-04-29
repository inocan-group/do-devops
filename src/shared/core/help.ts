import chalk from "chalk";
import commandLineUsage from "command-line-usage";
import { DoDevopObservation, Finalized, IDoDevopsCommand } from "~/@types";
import { emoji } from "~/shared/ui";
import { globalOptions, convertOptionsToArray } from "./index";
import {
  formatCommandsSection,
  finalizeCommandDefinition,
  globalCommandDescriptions,
} from "./util";

/**
 * Provide help on **do-devops**, either in a global sense or for a
 * particular function.
 */
export function help(observations: DoDevopObservation[], cmdDefn?: IDoDevopsCommand) {
  const { kind, subCommands, description, syntax, options } = cmdDefn
    ? finalizeCommandDefinition(cmdDefn, observations)
    : ({
        subCommands: globalCommandDescriptions(observations),
        description:
          "do-devops is a set of utility functions designed to make DevOps more fun in less time",
        syntax: "dd [cmd] [options]",
        options: globalOptions,
      } as Finalized<IDoDevopsCommand>);

  const sections: commandLineUsage.Section[] = [
    {
      header: "Description",
      content: description,
    },
    {
      header: "Syntax",
      content: syntax,
    },
  ];

  if (subCommands) {
    sections.push(formatCommandsSection(subCommands, kind));
  }

  if (kind) {
    sections.push({
      header: "Options",
      optionList: convertOptionsToArray(options || {}),
    });
  }

  try {
    console.log(commandLineUsage(sections));
  } catch (error) {
    console.log(`  - ${emoji.poop}  ${chalk.red("Problem displaying help:")} ${error.message}\n`);
    console.log(chalk.grey(error.stack));
  }
  console.log();
  process.exit();
}

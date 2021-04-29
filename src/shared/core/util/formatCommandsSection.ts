import { ICommandDescription, KnownCommand } from "~/@types";
import { Section } from "command-line-usage";
import chalk from "chalk";
import { isOdd } from "native-dash";

/**
 * Converts a set of commands into a display section
 */
export function formatCommandsSection(
  subCommands: ICommandDescription[],
  cmd?: KnownCommand
): Section {
  return {
    header: cmd ? chalk`Sub-Commands for {bold ${cmd}}` : `Commands`,
    content: subCommands.map((sc, idx) => ({
      name: isOdd(idx) ? chalk`{dim ${sc.name}}` : sc.name,
      summary: isOdd(idx) ? chalk`{dim ${sc.summary}}` : sc.summary,
    })),
  };
}

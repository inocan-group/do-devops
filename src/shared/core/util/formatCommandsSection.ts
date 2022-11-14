import { ICommandDescription, KnownCommand } from "src/@types";
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
    header: cmd ? `Sub-Commands for {bold ${cmd}}` : `Commands`,
    content: subCommands.map((sc, idx) => ({
      name: isOdd(idx) ? `{dim ${sc.name}}` : sc.name,
      summary: isOdd(idx) ? `{dim ${sc.summary}}` : sc.summary,
    })),
  };
}

import chalk from "chalk";
import commandLineUsage from "command-line-usage";
import { IDictionary } from "common-types";

import { emoji, getDescription, getHelpCommands, getOptions, getSyntax } from "../ui";

/**
 * Gets meta information about the specific funcctions syntax, commands, description, and options
 */
async function getHelpMeta(opts: IDictionary, fn?: string) {
  try {
    const syntax = await getSyntax(fn);
    const commands = await getHelpCommands(fn);
    const options = await getOptions(opts, fn);
    const description = await getDescription(opts, fn);

    return { commands, options, syntax, description };
  } catch (error) {
    console.log(
      `  - ${emoji.poop}  ${chalk.red.bold("Problem getting help meta:")} ${
        error.message
      }\n`
    );
    console.log(chalk.grey(error.stack));
    process.exit();
  }
}

/**
 * Provide help on **do-devops**, either in a global sense or for a
 * particular function.
 */
export async function help(opts: IDictionary, fn?: string) {
  const { commands, description, syntax, options } = await getHelpMeta(opts, fn);

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

  if (commands && commands.length > 0) {
    sections.push({
      header: fn ? `${fn.toUpperCase()} Sub-Commands` : "Commands",
      content: commands,
    });
  }

  if (fn) {
    sections.push({
      header: "Options",
      optionList: options,
    });
  }

  try {
    console.log(commandLineUsage(sections));
  } catch (error) {
    console.log(
      `  - ${emoji.poop}  ${chalk.red("Problem displaying help:")} ${error.message}\n`
    );
    console.log(chalk.grey(error.stack));
  }
  console.log();
  process.exit();
}

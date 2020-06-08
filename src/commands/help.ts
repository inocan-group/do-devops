import * as chalk from "chalk";
import * as commandLineUsage from "command-line-usage";

import { emoji, getDescription, getHelpCommands, getOptions, getSyntax } from "../shared/ui/index";

import { IDictionary } from "common-types";

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
  } catch (e) {
    console.log(`  - ${emoji.poop}  ${chalk.red("Problem displaying help:")} ${e.message}\n`);
    console.log(chalk.grey(e.stack));
  }
  console.log();
  process.exit();
}

async function getHelpMeta(opts: IDictionary, fn?: string) {
  try {
    const syntax = await getSyntax(fn);
    const commands = await getHelpCommands(fn);
    const options = await getOptions(opts, fn);
    const description = await getDescription(opts, fn);

    return { commands, options, syntax, description };
  } catch (e) {
    console.log(`  - ${emoji.poop}  ${chalk.red.bold("Problem getting help meta:")} ${e.messsage}\n`);
    console.log(chalk.grey(e.stack));
    process.exit();
  }
}

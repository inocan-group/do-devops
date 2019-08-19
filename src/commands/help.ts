import commandLineUsage, { Section } from "command-line-usage";
import chalk from "chalk";
import { getCommands, getSyntax, getDescription, emoji } from "../shared/ui";
import { getOptions } from "../shared";
import { IDictionary } from "common-types";

export async function help(opts: IDictionary, fn?: string) {
  const { commands, description, syntax, options } = await getHelpMeta(
    opts,
    fn
  );

  const sections: commandLineUsage.Section[] = [
    {
      header: "Description",
      content: description
    },
    {
      header: "Syntax",
      content: syntax
    }
  ];

  if (commands && commands.length > 0) {
    sections.push({
      header: "Commands",
      content: commands
    });
  }

  if (fn) {
    sections.push({
      header: "Options",
      optionList: options
    });
  }

  try {
    console.log(commandLineUsage(sections));
  } catch (e) {
    console.log(
      `  - ${emoji.poop}  ${chalk.red("Problem displaying help:")} ${
        e.message
      }\n`
    );
    console.log(chalk.grey(e.stack));
  }
  console.log();
  process.exit();
}

async function getHelpMeta(opts: IDictionary, fn?: string) {
  try {
    const commands = await getCommands(fn);
    const syntax = await getSyntax(fn);
    const options = await getOptions(opts, fn);
    const description = await getDescription(opts, fn);

    return { commands, options, syntax, description };
  } catch (e) {
    console.log(
      `  - ${emoji.poop}  ${chalk.red.bold("Problem getting help meta:")} ${
        e.messsage
      }\n`
    );
    console.log(chalk.grey(e.stack));
    process.exit();
  }
}

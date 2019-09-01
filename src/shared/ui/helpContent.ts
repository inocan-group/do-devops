import chalk from "chalk";
import { commands } from "../commands";
import { globalOptions } from "../options";
import { OptionDefinition } from "command-line-usage";
import { IDictionary } from "common-types";
import { ICommandDescription } from "../../@types";

export async function getCommands(fn?: string) {
  let meta: ICommandDescription[] = [];
  let bold = false;
  if (fn) {
    const defn = await import(`../../commands/${fn}`);
    meta = defn.commands ? defn.commmands : [];
  } else {
    for (const cmd of commands()) {
      const ref = await import(`../../commands/${cmd}`);
      meta.push({
        name: cmd,
        summary: bold
          ? chalk.bold(ref.description ? ref.description() : "")
          : ref.description
          ? typeof ref.description === "function"
            ? await ref.description()
            : ref.description
          : ""
      });
    }
  }

  return formatCommands(meta);
}

/**
 * Formats commands so that:
 *
 * 1. alternating white/dim per line item
 * 2. multi-line descriptions are truncated to first line
 */
function formatCommands(cmds: ICommandDescription[]) {
  let dim = false;
  return cmds.map(cmd => {
    cmd.name = dim ? `{dim ${cmd.name}}` : cmd.name;
    const summary = cmd.summary.split("\n")[0];
    console.log(summary, cmd.summary);

    cmd.summary = dim ? `{dim ${summary}}` : summary;
    dim = !dim;

    return cmd;
  });
}

/**
 * Gets the syntax for the help system for both "global help"
 * as well as on a per function basis. The syntax for a function
 * can be manually set by providing a `syntax` symbol on the
 * command. If not provided a default syntax will be used.
 */
export async function getSyntax(fn?: string): Promise<string> {
  if (!fn) {
    return "do [command] <options>";
  }

  const defn = await import(`../../commands/${fn}`);
  const hasSubCommands = defn.subCommands ? true : false;

  return defn.syntax
    ? defn.syntax
    : `do ${fn} ${hasSubCommands ? "[command] " : ""}<options>`;
}

/**
 * Gets the "description" content for the help area
 */
export async function getDescription(opts: IDictionary, fn?: string) {
  if (!fn) {
    return `DevOps toolkit [ ${chalk.bold.italic(
      "do"
    )} ] is a simple CLI interface intended to automate most of the highly repeatable tasks on your team.`;
  }

  const defn = await import(`../../commands/${fn}`);
  const hasDescription = defn.description ? true : false;
  const defnIsFunction = typeof defn.description === "function";

  return hasDescription
    ? defnIsFunction
      ? await defn.description(opts)
      : defn.description
    : `Help content for the {bold do}'s ${chalk.bold.green.italic(
        fn
      )} command.`;
}

export async function getOptions(opts: IDictionary, fn?: string) {
  let options: OptionDefinition[] = [];
  if (fn) {
    const defn = await import(`../../commands/${fn}`);
    if (defn.options) {
      options = options.concat(
        typeof defn.options === "function"
          ? await defn.options(opts)
          : defn.options
      );
    }
  }
  options = options.concat(globalOptions);

  return options;
}

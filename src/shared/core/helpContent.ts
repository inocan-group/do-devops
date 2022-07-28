import chalk from "chalk";
import { IDictionary } from "common-types";
import { IOptionDefinition } from "src/@types";
import { convertOptionsToArray } from "src/shared/core";

// /**
//  * Formats commands so that:
//  *
//  * 1. alternating white/dim per line item
//  * 2. multi-line descriptions are truncated to first line
//  */
// function formatCommands(cmds: ICommandDescription[]) {
//   let dim = false;

//   return cmds.map((cmd) => {
//     const summary = Array.isArray(cmd.summary) ? cmd.summary.split("\n")[0] : cmd.summary;

//     cmd.name = dim ? `{dim ${cmd.name}}` : cmd.name;
//     cmd.summary = dim ? `{dim ${summary}}` : summary;
//     dim = !dim;

//     return cmd;
//   });
// }

/**
 * Gets the syntax for the help system for both "global help"
 * as well as on a per function basis. The syntax for a function
 * can be manually set by providing a `syntax` symbol on the
 * command. If not provided a default syntax will be used.
 */
export async function getSyntax(fn?: string): Promise<string> {
  if (!fn) {
    return "dd [command] <options>";
  }

  const defn = await import(`src/commands/${fn}`);
  const hasSubCommands = defn.subCommands ? true : false;

  return defn.syntax ? defn.syntax : `do ${fn} ${hasSubCommands ? "[command] " : ""}<options>`;
}

/**
 * Gets the "description" content for the help area
 */
export async function getDescription(opts: IDictionary, fn?: string) {
  if (!fn) {
    return `DevOps toolkit [ ${chalk.bold.italic(
      "dd"
    )} ] is a simple CLI interface intended to automate most of the highly repeatable tasks on your team.`;
  }

  const defn = await import(`../../commands/${fn}`);
  const hasDescription = defn.description ? true : false;
  const defnIsFunction = typeof defn.description === "function";

  return hasDescription
    ? defnIsFunction
      ? await defn.description(opts)
      : defn.description
    : `Help content for the {bold do}'s ${chalk.bold.green.italic(fn)} command.`;
}

/**
 *
 * @param opts
 * @param fn
 */
export async function getExamples(opts: IDictionary, fn?: string) {
  // nothing to do if no function is chosen
  if (fn) {
    const defn = await import(`../../commands/${fn}`);
    const hasExamples = defn.examples ? true : false;
    const defnIsFunction = typeof defn.examples === "function";

    if (hasExamples && !defnIsFunction && !Array.isArray(defn.examples)) {
      throw new Error(
        `Getting help on "${fn}" has failed because the examples section -- while configured -- is of the wrong format! Should be a function returning an array or an array of .`
      );
    }
    // const examples = defnIsFunction ? defn.examples(opts) : defn.examples;

    return hasExamples ? (defnIsFunction ? await defn.description(opts) : defn.description) : "";
  }
}

export async function getOptions(opts: IOptionDefinition, _fn?: string) {
  return convertOptionsToArray(opts);
  // let options: OptionDefinition[] = [];
  // if (fn) {
  //   const defn = await import(`../../commands/${fn}`);
  //   if (defn.options) {
  //     options = options.concat(typeof defn.options === "function" ? await defn.options(opts) : defn.options);
  //   }
  // }
  // options = options.concat(globalOptions);

  // return options;
  // return globalAndLocalOptions(opts, fn);
}

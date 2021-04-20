import chalk from "chalk";

import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
import { getCommandInterface } from "./getCommandInterface";

export interface IGlobalOptions {
  output?: string;
  quiet?: boolean;
  verbose?: boolean;
  help?: boolean;
}

export const globalOptions: OptionDefinition[] = [
  {
    name: "output",
    alias: "o",
    type: String,
    group: "global",
    description: "sends output to the filename specified (in JSON format)",
    typeLabel: "<filename>",
  },
  {
    name: "quiet",
    alias: "q",
    type: Boolean,
    group: "global",
    description: chalk`stops all output to {italic stdout}`,
  },
  {
    name: "verbose",
    alias: "v",
    type: Boolean,
    group: "global",
    description: "makes the output more verbose",
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    group: "global",
    description: "shows help for given command",
  },
];

/**
 * A list of all options from all commands (including global options)
 */
export async function globalAndLocalOptions(optsSet: IDictionary, fn: string) {
  let options: OptionDefinition[] = [];

  const cmdDefn = fn ? getCommandInterface(fn) : ({} as IDictionary);
  if (cmdDefn.options) {
    const localOptions: OptionDefinition[] =
      typeof cmdDefn.options === "object"
        ? cmdDefn.options
        : await cmdDefn.options(optsSet);
    const localNames = new Set(localOptions.map((i) => i.name));

    const nonInterferingGlobal = globalOptions.filter((i) => !localNames.has(i.name));
    options = [...localOptions, ...nonInterferingGlobal];
  } else {
    options = globalOptions;
  }

  return options;
}

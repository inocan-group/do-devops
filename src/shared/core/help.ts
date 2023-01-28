/* eslint-disable unicorn/no-process-exit */
import chalk from "chalk";
import commandLineUsage, { OptionDefinition } from "command-line-usage";
import { DoDevopObservation, Finalized, Command } from "src/@types";
import { emoji } from "src/shared/ui";
import { globalOptions } from "./index";
import {
  formatCommandsSection,
  finalizeCommandDefinition,
  globalCommandDescriptions,
} from "./util";

/**
 * Provide help on **do-devops**, either in a global sense or for a
 * particular function.
 */
export function help(
  observations: Set<DoDevopObservation>,
  /** optionally pass in the command which help is being asked for */
  cmdDefn?: Command
) {
  const { kind, subCommands, description, syntax, options } = cmdDefn
    ? finalizeCommandDefinition(cmdDefn, observations)
    : ({
        subCommands: globalCommandDescriptions(observations),
        description:
          "do-devops is a set of utility functions designed to make DevOps more fun in less time",
        syntax: "dd [cmd] [options]",
        options: globalOptions,
      } as Finalized<Command>);
  
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

  const defaultOptions: OptionDefinition[] = [];
  const o = options || {};

  if (kind) {
    sections.push({
      header: "Options",
      optionList: Object.keys(o).reduce((acc, key) => {
        if (o[key].defaultOption) {
          defaultOptions.push({ ...o[key], name: key });
          return acc;
        }

        return [...acc, { ...o[key], name: key }] as OptionDefinition[];
      }, [] as OptionDefinition[]),
    });
  }

  try {
    console.log(commandLineUsage(sections));
  } catch (error) {
    console.log(
      `  - ${emoji.poop}  ${chalk.red("Problem displaying help:")} ${(error as Error).message}\n`
    );
    console.log(chalk.grey((error as Error).stack));
  }
  console.log();
  process.exit(-1);
}

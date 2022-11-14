import chalk from "chalk";

/**
 * Description of command for help text
 */
export function description(..._opts: any[]) {
  return `allows an easy interaction with AWS's {bold {yellow SSM}} parameter system for managing secrets. Subcommands include: {italic set}, {italic get}, and {italic list}.`;
}

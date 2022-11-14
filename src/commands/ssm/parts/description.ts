import chalk from "chalk";

/**
 * Description of command for help text
 */
export function description(..._opts: any[]) {
  return `allows an easy interaction with AWS's ${chalk.bold.yellow`SSM`} parameter system for managing secrets. Subcommands include: ${chalk.italic`set`}, ${chalk.italic`get`}, and ${chalk.italic`list`}.`;
}

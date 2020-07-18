import chalk = require("chalk");

/**
 * Description of command for help text
 */
export function description(...opts: any[]) {
  return chalk`allows an easy interaction with AWS's SSM parameter system for managing secrets. Subcommands include: {italic set], {italic get}, and {italic list}`;
}

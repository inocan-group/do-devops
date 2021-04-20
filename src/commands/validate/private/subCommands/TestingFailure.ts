import { ValidationAction } from "../../public";
import { exec } from "async-shelljs";
import { IDictionary } from "common-types";
import chalk from "chalk";
import { emoji } from "~/shared/ui";

export async function handler(
  action: ValidationAction,
  _currentBranch: string,
  options: IDictionary = {}
) {
  const target = options.target || "dd test";
  if (options.quiet) {
    console.log(chalk`- ${emoji.run} running unit tests`);
  }

  const result = exec(`yarn ${target}`, { silent: options.quiet });
  if (options.quiet) {
    if (result.code === 0) {
      console.log(chalk`- ${emoji.party} unit tests were successful!`);
    } else {
      console.log(chalk`- ${emoji.poop} unit tests failed!`);
    }
  }

  // return real result code if error; otherwise just report a normal exit
  return action === "error" ? result.code : 0;
}

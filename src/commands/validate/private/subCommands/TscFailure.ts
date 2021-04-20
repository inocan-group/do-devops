import chalk from "chalk";
import { emoji } from "~/shared/ui";
import { ValidationAction } from "../../public";
import { IDictionary } from "common-types";
import { exec } from "async-shelljs";

export async function handler(
  action: ValidationAction,
  _currentBranch: string,
  options: IDictionary = {}
) {
  console.log(
    chalk`- ${emoji.eyeballs} ensuring Typescript compiler reports no errors in transpilation`
  );

  const result = exec("yarn tsc", { silent: options.quiet });
  if (result.code === 0) {
    console.log(chalk`- ${emoji.party} transpilation found no issues!`);
  }

  if (options.quiet && result.code !== 0) {
    console.log(chalk`- ${emoji.poop} transpilation failed!`);
  }

  // return real result code if error; otherwise just report a normal exit
  return action === "error" ? result.code : 0;
}

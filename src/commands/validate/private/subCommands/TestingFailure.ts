import { ValidationAction } from "../../public";
import { asyncExec, exec } from "async-shelljs";
import { IDictionary } from "common-types";
import chalk = require("chalk");
import { emoji } from "../../../../shared";

export async function handler(action: ValidationAction, currentBranch: string, options: IDictionary = {}) {
  const target = options.target || "do test";
  if (options.quiet) console.log(chalk`- ${emoji.run} running unit tests`);

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

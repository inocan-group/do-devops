import inquirer = require("inquirer");
import { getLocalServerlessFunctions } from "./getLocalServerlessFunctions";

/**
 * Asks the user to choose an AWS region
 */
export async function askForFunction(): Promise<string> {
  const fns = Object.keys(await getLocalServerlessFunctions());
  const question: inquirer.ListQuestion = {
    type: "list",
    name: "fn",
    message: "Which function do you want to use?",
    default: fns[0],
    choices: fns
  };
  const answer = await inquirer.prompt(question);
  return answer.fn;
}

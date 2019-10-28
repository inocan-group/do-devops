import inquirer = require("inquirer");
import { getLocalServerlessFunctionsFromServerlessYaml } from "./getLocalServerlessFunctionsFromServerlessYaml";

/**
 * Asks the user to choose one or more handler functions
 */
export async function askForFunctions(
  message: string = "Which functions do you want to use?",
  defaults: string[] = []
): Promise<string[]> {
  const fns = Object.keys(
    await getLocalServerlessFunctionsFromServerlessYaml()
  );
  const question: inquirer.CheckboxQuestion = {
    type: "checkbox",
    message,
    name: "fns",
    choices: fns,
    default: defaults
  };
  const answer = await inquirer.prompt(question);
  return answer.fns;
}

/**
 * Asks the user to choose one or more handler functions
 */
export async function askForFunction(
  message: string = "Which function do you want to use?"
): Promise<string> {
  const fns = Object.keys(
    await getLocalServerlessFunctionsFromServerlessYaml()
  );
  const question: inquirer.ListQuestion = {
    type: "list",
    message,
    name: "fn",
    choices: fns
  };
  const answer = await inquirer.prompt(question);
  return answer.fn;
}

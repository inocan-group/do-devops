import inquirer = require("inquirer");

/**
 * Asks the user to choose an AWS region
 */
export async function askForStage(): Promise<string> {
  const question: inquirer.ListQuestion = {
    type: "list",
    name: "stage",
    message: "What stage are you working with?",
    default: "dev",
    choices: ["dev", "test", "stage", "prod"]
  };
  const answer = await inquirer.prompt(question);
  return answer.stage;
}

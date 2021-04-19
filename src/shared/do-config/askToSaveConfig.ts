import inquirer = require("inquirer");
import { saveToConfig } from "../../shared";

enum SaveChoice {
  project = "save to project's config (avail to all repo users)",
  user = "save as my personal default (saved to ~/do.config.js)",
  doNotSave = "dd not save",
}

/**
 * Asks the user if they'd like to save information to their project or user
 * `do.config.js` file.
 */
export async function askToSaveConfig(
  configPath: string,
  value: any,
  descriptor: string = "this"
): Promise<string> {
  const question: inquirer.ListQuestion = {
    type: "list",
    name: "saveTo",
    message: `Would you like to save ${descriptor} to your do-devops config?`,
    default: SaveChoice.project,
    choices: [SaveChoice.project, SaveChoice.user, SaveChoice.doNotSave],
  };
  const answer = await inquirer.prompt(question);
  if (answer.saveTo !== SaveChoice.doNotSave) {
    saveToConfig(
      configPath,
      value,
      answer.saveTo === SaveChoice.project ? "project" : "user"
    );
  }
  return answer.saveTo;
}

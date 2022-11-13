import inquirer, { ListQuestion } from "inquirer";
import { getDataFiles } from "src/shared/file";

/**
 * Asks the user to choose an AWS region
 */
export async function askForDataFile(listOfFiles?: string[]): Promise<string> {
  const files = listOfFiles ? listOfFiles : await getDataFiles();
  const question: ListQuestion = {
    type: "list",
    name: "file",
    message: "What data file would you like?",
    default: files[0],
    choices: files,
  };
  const answer = await inquirer.prompt(question);
  return answer.file;
}

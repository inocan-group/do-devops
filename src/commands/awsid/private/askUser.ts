import { checkboxQuestion } from "../../../shared/interactive";
import inquirer from "inquirer";

export async function askUser(profiles: string[]) {
  const question = checkboxQuestion({
    name: "profiles",
    message: "Choose the profiles you want ID's for",
    choices: profiles,
  });
  const answer = await inquirer.prompt([question]);
  return answer.profiles;
}

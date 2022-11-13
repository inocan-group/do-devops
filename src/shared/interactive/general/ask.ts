import inquirer, { Question } from "inquirer";

/**
 * Provides a simple wrapping of the actual "asking" aspect of
 * the **Inquirer** library to provide a simple _ask_ of one question.
 *
 * @param question the question to ask
 */
export async function ask(question: Question) {
  return inquirer.prompt([question]);
}

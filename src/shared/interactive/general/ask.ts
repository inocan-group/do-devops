import inquirer = require("inquirer");

/**
 * Provides a simple wrapping of the actual "asking" aspect of
 * the **Inquirer** library to provide a simple _ask_ of one question.
 *
 * @param question the question to ask
 */
export async function ask(question: inquirer.Question) {
  return inquirer.prompt([question]);
}

import { ListQuestion } from "inquirer";

/**
 * **listQuestion**
 *
 * Utility function to add a list based question to a
 * composed set of questions.
 *
 * ```ts
 * const survey = {
 *  ...listQuestion(
 *    "myQuestion",
 *    "What is your fav color?",
 *    ["red", "blue", "green"]
 *  );
 * };
 * ```
 *
 * Note: if you want to ask the question immediately, use
 * `listQuestionNow()` instead.
 */
export function listQuestion(
  name: string,
  question: string,
  choices: ListQuestion["choices"],
  defaultValue?: ListQuestion["default"]
): ListQuestion {
  return {
    type: "list",
    name,
    message: question,
    choices,
    default: defaultValue,
  };
}

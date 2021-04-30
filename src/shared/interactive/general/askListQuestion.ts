import { ListQuestion } from "inquirer";
import { ask } from "./ask";

/**
 * **listQuestionNow**
 *
 * Utility function to ask a list based question to a
 * user immediately.
 *
 * ```ts
 * const answer = listQuestionNow(
 *    "myQuestion",
 *    "What is your fav color?",
 *    ["red", "blue", "green"]
 * );
 * ```
 *
 * Note: if you want to compose the question with others,
 * use `listQuestion()` instead.
 */
export async function askListQuestion<T extends any = any>(
  question: string,
  choices: ListQuestion["choices"] & T[],
  defaultValue?: ListQuestion["default"]
) {
  const q: ListQuestion = {
    type: "list",
    name: "listValue",
    message: question,
    choices,
    default: defaultValue,
  };
  const answer = await ask(q);
  return answer.listValue as T;
}

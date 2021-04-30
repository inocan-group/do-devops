import { ListQuestion } from "inquirer";
import { ask } from "./ask";

/**
 * **askListQuestion**
 *
 * Utility function to ask a list based question to a
 * user immediately:
 *
 * ```ts
 * const answer = askListQuestion<T>(
 *    "What is your fav color?", ["red", "blue", "green"], "red"
 * );
 * ```
 *
 * Alternatively, if you pass an array of _hashes_ where the hash
 * can have `name`, `value` and `disabled` properties.
 */
export async function askListQuestion<T extends any = any>(
  question: string,
  choices: (ListQuestion["choices"] & T[]) | (ListQuestion["choices"] & { value: T }[]),
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

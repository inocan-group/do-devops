import { ListQuestion } from "inquirer";
import { IInteractiveOptions } from "~/@types";
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
export async function askListQuestion<T extends string | number | object>(
  question: string,
  choices: ListQuestion<T[]>["choices"],
  options: IInteractiveOptions<T[]> = {}
): Promise<T> {
  const q = {
    type: "list",
    name: "listValue",
    message: question,
    choices,
    default: options.default,
    ...(options.when ? { when: options.when } : { when: () => true }),
  };
  const answer = await ask(q);

  return answer.listValue as T;
}

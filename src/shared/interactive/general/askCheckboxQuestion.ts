import { ListQuestion } from "inquirer";
import { IInteractiveOptions } from "~/@types";
import { ask } from "./ask";

/**
 * **askCheckboxQuestion**
 *
 * Utility function to provide an set of choices and allowing
 * the user to check as many as they want.
 *
 * ```ts
 * const answer = askListQuestion<T>(
 *    "What is your fav color?", ["red", "blue", "green"],
 *    { default: [ "red", "blue" ]}
 * );
 * ```
 *
 * Alternatively, if you pass an array of _hashes_ where the hash
 * can have `name`, `value` and `disabled` properties.
 */
export async function askCheckboxQuestion<T extends string | number | object>(
  question: string,
  choices: ListQuestion<T[]>["choices"],
  options: IInteractiveOptions<T[]> = {}
): Promise<T[]> {
  const q = {
    type: "checkbox",
    name: "checkedValues",
    message: question,
    choices,
    default: options.default,
    ...(options.when ? { when: options.when } : { when: () => true }),
  };
  const answer = await ask(q);

  return answer.checkedValues as T[];
}

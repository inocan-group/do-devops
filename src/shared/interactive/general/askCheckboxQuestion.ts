import { Choices, IInteractiveOptions } from "~/@types";
import { ask } from "./ask";
import { convertChoices } from "./convertChoices";

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
export async function askCheckboxQuestion<T extends Choices>(
  question: string,
  choices: T,
  options: IInteractiveOptions<T, true> = {}
): Promise<T> {
  const defaultValues = {
    when: options.when || (() => true),
    default: options.default || convertChoices(choices)[0].value,
  };

  const q = {
    type: "checkbox",
    name: "checkedValues",
    message: question,
    choices,
    ...defaultValues,
  };
  const answer = await ask(q);

  return answer.checkedValues as T;
}

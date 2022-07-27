import { Keys } from "inferred-types";
import { ListQuestion } from "inquirer";
import { Choices, IInteractiveOptions } from "~/@types";
import { ask } from "./ask";
import { convertChoices } from "./convertChoices";

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
export async function askListQuestion<T extends Choices>(
  question: string,
  choices: T,
  options: IInteractiveOptions<T> = {}
): Promise<Keys<T>> {
  const defaultValues = {
    when: options.when || (() => true),
    default: options.default || convertChoices(choices)[0].value,
  };

  const q: ListQuestion = {
    type: "list",
    name: "listValue",
    message: question,
    choices: convertChoices(choices),
    ...defaultValues,
  };
  const answer = await ask(q);

  return answer.listValue;
}

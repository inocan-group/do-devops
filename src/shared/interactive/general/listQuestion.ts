import { ListQuestion } from "inquirer";
import { Choices, IInteractiveOptions } from "src/@types/interactive-types";
import { convertChoices } from "./convertChoices";

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
 * Note: choices can be an array of values or an array of `IChoice` which
 * requires the `name` and `value` and allows a `short` property as well.
 */
export function listQuestion<T extends Choices>(
  name: string,
  question: string,
  choices: T,
  options: IInteractiveOptions<T> = {}
): ListQuestion<T> {
  const defaultValues = {
    when: options.when || (() => true),
    default: options.default || convertChoices(choices)[0].value,
  };

  return {
    name,
    type: "list" as const,
    message: question,
    choices: convertChoices(choices),
    ...defaultValues,
  };
}
